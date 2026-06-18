from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import httpx
import jwt
from datetime import datetime, timedelta

from app.database import get_db
from app.configuration import settings
from app.models.user import User

router = APIRouter()


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


CLI_CALLBACK_PORT = 9876


@router.get("/github")
def github_login(cli: bool = False):
    """Redirect user to GitHub OAuth page.
    
    Pass ?cli=true when initiating login from the CLI so the callback
    redirects to the local CLI listener instead of the frontend.
    """
    state = "cli" if cli else "web"
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&redirect_uri={settings.GITHUB_REDIRECT_URI}"
        f"&scope=read:user,user:email,repo"
        f"&state={state}"
    )
    return RedirectResponse(url=github_auth_url)


@router.get("/github/callback")
async def github_callback(code: str, state: str = "web", db: Session = Depends(get_db)):
    """Handle GitHub OAuth callback and return JWT.
    
    If state == 'cli', redirects to the local CLI callback listener.
    Otherwise redirects to the frontend.
    """

    # Exchange code for access token
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GITHUB_REDIRECT_URI,
            },
            headers={"Accept": "application/json"},
        )
        token_data = token_response.json()

    access_token = token_data.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to get GitHub access token")

    # Fetch GitHub user profile
    async with httpx.AsyncClient() as client:
        user_response = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        github_user = user_response.json()

    # Upsert user in database
    user = db.query(User).filter(User.github_id == github_user["id"]).first()
    if not user:
        user = User(
            github_id=github_user["id"],
            username=github_user["login"],
            name=github_user.get("name"),
            email=github_user.get("email"),
            avatar_url=github_user.get("avatar_url"),
            bio=github_user.get("bio"),
            location=github_user.get("location"),
            public_repos=github_user.get("public_repos", 0),
            followers=github_user.get("followers", 0),
            following=github_user.get("following", 0),
            github_access_token=access_token,
        )
        db.add(user)
    else:
        user.github_access_token = access_token
        user.name = github_user.get("name")
        user.avatar_url = github_user.get("avatar_url")
        user.public_repos = github_user.get("public_repos", 0)
        user.followers = github_user.get("followers", 0)

    db.commit()
    db.refresh(user)

    jwt_token = create_access_token({"sub": str(user.id), "username": user.username})

    # CLI login: redirect to local listener instead of frontend
    if state == "cli":
        return RedirectResponse(
            url=f"http://localhost:{CLI_CALLBACK_PORT}/callback?token={jwt_token}"
        )

    return RedirectResponse(
        url=f"{settings.FRONTEND_URL}/auth/callback?token={jwt_token}"
    )
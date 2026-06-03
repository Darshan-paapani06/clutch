from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.github_service import GitHubService
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/activity")
async def get_activity(
    days: int = 30,
    current_user: User = Depends(get_current_user),
):
    """Get user's GitHub activity for the past N days."""
    service = GitHubService(current_user.github_access_token)
    return await service.get_activity(current_user.username, days=days)


@router.get("/streak")
async def get_streak(
    current_user: User = Depends(get_current_user),
):
    """Get the user's current and longest commit streak."""
    service = GitHubService(current_user.github_access_token)
    return await service.get_streak(current_user.username)


@router.get("/languages")
async def get_languages(
    current_user: User = Depends(get_current_user),
):
    """Get language breakdown across user's repositories."""
    service = GitHubService(current_user.github_access_token)
    return await service.get_language_breakdown(current_user.username)


@router.post("/sync")
async def sync_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Manually trigger a sync of GitHub activity to the database."""
    service = GitHubService(current_user.github_access_token)
    synced = await service.sync_to_db(current_user, db)
    return {"message": "Sync complete", "synced_days": synced}
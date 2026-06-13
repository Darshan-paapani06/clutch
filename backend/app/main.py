from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, github, users, insights
from app.configuration import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Clutch API",
    description="GitHub tracks your work. Clutch tracks you.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(github.router, prefix="/github", tags=["GitHub"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(insights.router, prefix="/insights", tags=["Insights"])


@app.get("/")
def root():
    return {"message": "Clutch API is live 🚀", "version": "0.1.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)

    # Profile info
    name = Column(String(200))
    email = Column(String(200), index=True)  # indexed for faster lookups
    avatar_url = Column(String(500))
    bio = Column(Text)
    location = Column(String(200))

    # GitHub stats
    public_repos = Column(Integer, default=0, nullable=False)
    followers = Column(Integer, default=0, nullable=False)
    following = Column(Integer, default=0, nullable=False)

    # OAuth tokens
    github_access_token = Column(String(500))

    # App fields
    is_active = Column(Boolean, default=True, nullable=False)
    is_public = Column(Boolean, default=True, nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_synced_at = Column(DateTime(timezone=True))

    # Relationships
    activities = relationship("DailyActivity", back_populates="user", cascade="all, delete-orphan")
    weekly_insights = relationship("WeeklyInsight", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"

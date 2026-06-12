from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.auth import get_current_user
from app.models import UserProfile
from app.schemas import UserProfileUpdate

router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("/profile")
def get_profile(user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    profile = session.exec(select(UserProfile).where(UserProfile.user_id == user_id)).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        session.add(profile)
        session.commit()
        session.refresh(profile)
    return profile


@router.put("/profile")
def update_profile(body: UserProfileUpdate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    profile = session.exec(select(UserProfile).where(UserProfile.user_id == user_id)).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)
    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile

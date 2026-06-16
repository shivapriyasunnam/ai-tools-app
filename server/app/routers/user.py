from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.auth import get_current_user, get_current_user_payload
from app.models import UserProfile
from app.schemas import UserProfileUpdate

router = APIRouter(prefix="/api/user", tags=["user"])


def _first_name_from_metadata(payload: dict) -> str | None:
    metadata = payload.get("user_metadata") or {}
    given_name = metadata.get("given_name")
    if given_name:
        return given_name
    full_name = metadata.get("full_name") or metadata.get("name")
    if full_name:
        return full_name.split(" ")[0]
    return None


@router.get("/profile")
def get_profile(payload: dict = Depends(get_current_user_payload), session: Session = Depends(get_session)):
    user_id = payload["sub"]
    profile = session.exec(select(UserProfile).where(UserProfile.user_id == user_id)).first()
    if not profile:
        profile = UserProfile(user_id=user_id, name=_first_name_from_metadata(payload))
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

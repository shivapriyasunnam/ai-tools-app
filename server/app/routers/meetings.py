from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.auth import get_current_user
from app.models import Meeting
from app.schemas import MeetingCreate, MeetingUpdate

router = APIRouter(prefix="/api/meetings", tags=["meetings"])


@router.get("")
def list_meetings(user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(Meeting).where(Meeting.user_id == user_id)).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_meeting(body: MeetingCreate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    meeting = Meeting(**body.model_dump(), user_id=user_id)
    session.add(meeting)
    session.commit()
    session.refresh(meeting)
    return meeting


@router.put("/{meeting_id}")
def update_meeting(meeting_id: str, body: MeetingUpdate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    meeting = session.get(Meeting, meeting_id)
    if not meeting or meeting.user_id != user_id:
        raise HTTPException(status_code=404, detail="Meeting not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(meeting, key, value)
    session.add(meeting)
    session.commit()
    session.refresh(meeting)
    return meeting


@router.delete("/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(meeting_id: str, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    meeting = session.get(Meeting, meeting_id)
    if not meeting or meeting.user_id != user_id:
        raise HTTPException(status_code=404, detail="Meeting not found")
    session.delete(meeting)
    session.commit()

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.auth import get_current_user
from app.models import Reminder
from app.schemas import ReminderCreate, ReminderUpdate

router = APIRouter(prefix="/api/reminders", tags=["reminders"])


@router.get("")
def list_reminders(user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(Reminder).where(Reminder.user_id == user_id)).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_reminder(body: ReminderCreate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    reminder = Reminder(**body.model_dump(), user_id=user_id)
    session.add(reminder)
    session.commit()
    session.refresh(reminder)
    return reminder


@router.put("/{reminder_id}")
def update_reminder(reminder_id: str, body: ReminderUpdate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    reminder = session.get(Reminder, reminder_id)
    if not reminder or reminder.user_id != user_id:
        raise HTTPException(status_code=404, detail="Reminder not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(reminder, key, value)
    session.add(reminder)
    session.commit()
    session.refresh(reminder)
    return reminder


@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(reminder_id: str, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    reminder = session.get(Reminder, reminder_id)
    if not reminder or reminder.user_id != user_id:
        raise HTTPException(status_code=404, detail="Reminder not found")
    session.delete(reminder)
    session.commit()

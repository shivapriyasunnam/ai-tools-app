from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.auth import get_current_user
from app.models import PomodoroSession
from app.schemas import PomodoroSessionCreate, PomodoroSessionUpdate

router = APIRouter(prefix="/api/pomodoro", tags=["pomodoro"])


@router.get("")
def list_sessions(user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(PomodoroSession).where(PomodoroSession.user_id == user_id)).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_session(body: PomodoroSessionCreate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    pomodoro = PomodoroSession(**body.model_dump(), user_id=user_id)
    session.add(pomodoro)
    session.commit()
    session.refresh(pomodoro)
    return pomodoro


@router.put("/{session_id}")
def update_session(session_id: str, body: PomodoroSessionUpdate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    pomodoro = session.get(PomodoroSession, session_id)
    if not pomodoro or pomodoro.user_id != user_id:
        raise HTTPException(status_code=404, detail="Session not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(pomodoro, key, value)
    session.add(pomodoro)
    session.commit()
    session.refresh(pomodoro)
    return pomodoro

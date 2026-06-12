from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.auth import get_current_user
from app.models import Note
from app.schemas import NoteCreate, NoteUpdate

router = APIRouter(prefix="/api/notes", tags=["notes"])


@router.get("")
def list_notes(user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(Note).where(Note.user_id == user_id)).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_note(body: NoteCreate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    note = Note(**body.model_dump(), user_id=user_id)
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


@router.put("/{note_id}")
def update_note(note_id: str, body: NoteUpdate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    note = session.get(Note, note_id)
    if not note or note.user_id != user_id:
        raise HTTPException(status_code=404, detail="Note not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(note, key, value)
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: str, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    note = session.get(Note, note_id)
    if not note or note.user_id != user_id:
        raise HTTPException(status_code=404, detail="Note not found")
    session.delete(note)
    session.commit()

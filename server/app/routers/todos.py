from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.auth import get_current_user
from app.models import Todo
from app.schemas import TodoCreate, TodoUpdate

router = APIRouter(prefix="/api/todos", tags=["todos"])


@router.get("")
def list_todos(user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(Todo).where(Todo.user_id == user_id)).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_todo(body: TodoCreate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    todo = Todo(**body.model_dump(), user_id=user_id)
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo


@router.put("/{todo_id}")
def update_todo(todo_id: str, body: TodoUpdate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    todo = session.get(Todo, todo_id)
    if not todo or todo.user_id != user_id:
        raise HTTPException(status_code=404, detail="Todo not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(todo, key, value)
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: str, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    todo = session.get(Todo, todo_id)
    if not todo or todo.user_id != user_id:
        raise HTTPException(status_code=404, detail="Todo not found")
    session.delete(todo)
    session.commit()

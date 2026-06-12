import uuid
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


def new_uuid() -> str:
    return str(uuid.uuid4())


def now() -> datetime:
    return datetime.utcnow()


class Expense(SQLModel, table=True):
    id: str = Field(default_factory=new_uuid, primary_key=True)
    user_id: str = Field(index=True)
    amount: float
    category: str
    description: Optional[str] = None
    date: str
    method: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=now)


class Income(SQLModel, table=True):
    id: str = Field(default_factory=new_uuid, primary_key=True)
    user_id: str = Field(index=True)
    amount: float
    date: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=now)


class Budget(SQLModel, table=True):
    id: str = Field(default_factory=new_uuid, primary_key=True)
    user_id: str = Field(index=True)
    category: str
    limit: float
    period: str
    color: Optional[str] = None
    created_at: datetime = Field(default_factory=now)


class Todo(SQLModel, table=True):
    id: str = Field(default_factory=new_uuid, primary_key=True)
    user_id: str = Field(index=True)
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[str] = None
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=now)


class Reminder(SQLModel, table=True):
    id: str = Field(default_factory=new_uuid, primary_key=True)
    user_id: str = Field(index=True)
    title: str
    description: Optional[str] = None
    completed: bool = False
    due_date: Optional[str] = None
    priority: Optional[str] = None
    created_at: datetime = Field(default_factory=now)


class Meeting(SQLModel, table=True):
    id: str = Field(default_factory=new_uuid, primary_key=True)
    user_id: str = Field(index=True)
    title: str
    start: str
    end: str
    organizer: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=now)


class Note(SQLModel, table=True):
    id: str = Field(default_factory=new_uuid, primary_key=True)
    user_id: str = Field(index=True)
    text: str
    created_at: datetime = Field(default_factory=now)


class PomodoroSession(SQLModel, table=True):
    __tablename__ = "pomodorosession"

    id: str = Field(default_factory=new_uuid, primary_key=True)
    user_id: str = Field(index=True)
    start: str
    end: Optional[str] = None
    type: str
    completed: bool = False
    created_at: datetime = Field(default_factory=now)


class UserProfile(SQLModel, table=True):
    __tablename__ = "userprofile"

    id: str = Field(default_factory=new_uuid, primary_key=True)
    user_id: str = Field(index=True, unique=True)
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=now)

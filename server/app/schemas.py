from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ExpenseCreate(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None
    date: str
    method: Optional[str] = None
    notes: Optional[str] = None


class ExpenseUpdate(BaseModel):
    amount: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    method: Optional[str] = None
    notes: Optional[str] = None


class IncomeCreate(BaseModel):
    amount: float
    date: str
    description: Optional[str] = None


class IncomeUpdate(BaseModel):
    amount: Optional[float] = None
    date: Optional[str] = None
    description: Optional[str] = None


class BudgetCreate(BaseModel):
    category: str
    limit: float
    period: str
    color: Optional[str] = None


class BudgetUpdate(BaseModel):
    category: Optional[str] = None
    limit: Optional[float] = None
    period: Optional[str] = None
    color: Optional[str] = None


class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[str] = None


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[str] = None
    completed_at: Optional[datetime] = None


class ReminderCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    due_date: Optional[str] = None
    priority: Optional[str] = None


class ReminderUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[str] = None
    priority: Optional[str] = None


class MeetingCreate(BaseModel):
    title: str
    start: str
    end: str
    organizer: Optional[str] = None
    description: Optional[str] = None


class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    start: Optional[str] = None
    end: Optional[str] = None
    organizer: Optional[str] = None
    description: Optional[str] = None


class NoteCreate(BaseModel):
    text: str


class NoteUpdate(BaseModel):
    text: Optional[str] = None


class PomodoroSessionCreate(BaseModel):
    start: str
    end: Optional[str] = None
    type: str
    completed: bool = False


class PomodoroSessionUpdate(BaseModel):
    end: Optional[str] = None
    completed: Optional[bool] = None


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None

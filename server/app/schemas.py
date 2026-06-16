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
    type: Optional[str] = None


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None


class PlanCreate(BaseModel):
    title: str
    description: Optional[str] = None
    duration: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class PlanUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    period: str
    category: str
    plan_id: Optional[str] = None
    linked_todo_ids: Optional[list[str]] = None


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    period: Optional[str] = None
    category: Optional[str] = None
    plan_id: Optional[str] = None
    completed: Optional[bool] = None
    completed_at: Optional[datetime] = None
    linked_todo_ids: Optional[list[str]] = None

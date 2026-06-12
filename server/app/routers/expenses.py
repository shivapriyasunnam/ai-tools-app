from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.auth import get_current_user
from app.models import Expense
from app.schemas import ExpenseCreate, ExpenseUpdate

router = APIRouter(prefix="/api/expenses", tags=["expenses"])


@router.get("")
def list_expenses(user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(Expense).where(Expense.user_id == user_id)).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_expense(body: ExpenseCreate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    expense = Expense(**body.model_dump(), user_id=user_id)
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense


@router.put("/{expense_id}")
def update_expense(expense_id: str, body: ExpenseUpdate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    expense = session.get(Expense, expense_id)
    if not expense or expense.user_id != user_id:
        raise HTTPException(status_code=404, detail="Expense not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(expense, key, value)
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: str, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    expense = session.get(Expense, expense_id)
    if not expense or expense.user_id != user_id:
        raise HTTPException(status_code=404, detail="Expense not found")
    session.delete(expense)
    session.commit()

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.auth import get_current_user
from app.models import Budget
from app.schemas import BudgetCreate, BudgetUpdate

router = APIRouter(prefix="/api/budgets", tags=["budgets"])


@router.get("")
def list_budgets(user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(Budget).where(Budget.user_id == user_id)).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_budget(body: BudgetCreate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    budget = Budget(**body.model_dump(), user_id=user_id)
    session.add(budget)
    session.commit()
    session.refresh(budget)
    return budget


@router.put("/{budget_id}")
def update_budget(budget_id: str, body: BudgetUpdate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    budget = session.get(Budget, budget_id)
    if not budget or budget.user_id != user_id:
        raise HTTPException(status_code=404, detail="Budget not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(budget, key, value)
    session.add(budget)
    session.commit()
    session.refresh(budget)
    return budget


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(budget_id: str, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    budget = session.get(Budget, budget_id)
    if not budget or budget.user_id != user_id:
        raise HTTPException(status_code=404, detail="Budget not found")
    session.delete(budget)
    session.commit()

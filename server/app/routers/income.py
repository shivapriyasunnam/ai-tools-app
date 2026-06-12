from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.auth import get_current_user
from app.models import Income
from app.schemas import IncomeCreate, IncomeUpdate

router = APIRouter(prefix="/api/income", tags=["income"])


@router.get("")
def list_income(user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(Income).where(Income.user_id == user_id)).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_income(body: IncomeCreate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    income = Income(**body.model_dump(), user_id=user_id)
    session.add(income)
    session.commit()
    session.refresh(income)
    return income


@router.put("/{income_id}")
def update_income(income_id: str, body: IncomeUpdate, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    income = session.get(Income, income_id)
    if not income or income.user_id != user_id:
        raise HTTPException(status_code=404, detail="Income not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(income, key, value)
    session.add(income)
    session.commit()
    session.refresh(income)
    return income


@router.delete("/{income_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_income(income_id: str, user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    income = session.get(Income, income_id)
    if not income or income.user_id != user_id:
        raise HTTPException(status_code=404, detail="Income not found")
    session.delete(income)
    session.commit()

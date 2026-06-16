import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select
from app.database import get_session
from app.auth import get_current_user
from app.models import Goal, Plan
from app.schemas import GoalCreate, GoalUpdate, PlanCreate, PlanUpdate

router = APIRouter(prefix="/api/goals", tags=["goals"])


def _serialize_ids(ids: list[str] | None) -> str | None:
    if ids is None:
        return None
    return json.dumps(ids)


def _deserialize_ids(raw: str | None) -> list[str]:
    if not raw:
        return []
    return json.loads(raw)


def _goal_to_dict(goal: Goal) -> dict:
    d = goal.model_dump()
    d["linked_todo_ids"] = _deserialize_ids(goal.linked_todo_ids)
    return d


# ── Plans ─────────────────────────────────────────────────────────────────────

@router.get("/plans")
def list_plans(
    user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return session.exec(select(Plan).where(Plan.user_id == user_id)).all()


@router.post("/plans", status_code=status.HTTP_201_CREATED)
def create_plan(
    body: PlanCreate,
    user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    plan = Plan(**body.model_dump(), user_id=user_id)
    session.add(plan)
    session.commit()
    session.refresh(plan)
    return plan


@router.put("/plans/{plan_id}")
def update_plan(
    plan_id: str,
    body: PlanUpdate,
    user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    plan = session.get(Plan, plan_id)
    if not plan or plan.user_id != user_id:
        raise HTTPException(status_code=404, detail="Plan not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(plan, key, value)
    session.add(plan)
    session.commit()
    session.refresh(plan)
    return plan


@router.delete("/plans/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plan(
    plan_id: str,
    user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    plan = session.get(Plan, plan_id)
    if not plan or plan.user_id != user_id:
        raise HTTPException(status_code=404, detail="Plan not found")
    # Detach goals from this plan rather than deleting them
    goals = session.exec(select(Goal).where(Goal.plan_id == plan_id)).all()
    for goal in goals:
        goal.plan_id = None
        session.add(goal)
    session.delete(plan)
    session.commit()


# ── Goals ─────────────────────────────────────────────────────────────────────

@router.get("")
def list_goals(
    plan_id: str | None = Query(default=None),
    user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    query = select(Goal).where(Goal.user_id == user_id)
    if plan_id is not None:
        query = query.where(Goal.plan_id == plan_id)
    goals = session.exec(query).all()
    return [_goal_to_dict(g) for g in goals]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_goal(
    body: GoalCreate,
    user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    data = body.model_dump()
    data["linked_todo_ids"] = _serialize_ids(data.get("linked_todo_ids"))
    goal = Goal(**data, user_id=user_id)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return _goal_to_dict(goal)


@router.put("/{goal_id}")
def update_goal(
    goal_id: str,
    body: GoalUpdate,
    user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    goal = session.get(Goal, goal_id)
    if not goal or goal.user_id != user_id:
        raise HTTPException(status_code=404, detail="Goal not found")
    data = body.model_dump(exclude_unset=True)
    if "linked_todo_ids" in data:
        data["linked_todo_ids"] = _serialize_ids(data["linked_todo_ids"])
    if data.get("completed") is True and not goal.completed:
        data.setdefault("completed_at", datetime.utcnow())
    elif data.get("completed") is False:
        data["completed_at"] = None
    for key, value in data.items():
        setattr(goal, key, value)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return _goal_to_dict(goal)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: str,
    user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    goal = session.get(Goal, goal_id)
    if not goal or goal.user_id != user_id:
        raise HTTPException(status_code=404, detail="Goal not found")
    session.delete(goal)
    session.commit()

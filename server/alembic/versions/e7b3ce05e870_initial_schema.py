"""initial schema

Revision ID: e7b3ce05e870
Revises: 
Create Date: 2026-06-12 07:27:28.649308

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e7b3ce05e870'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "expense",
        sa.Column("id", sa.String, primary_key=True),
        sa.Column("user_id", sa.String, nullable=False),
        sa.Column("amount", sa.Float, nullable=False),
        sa.Column("category", sa.String, nullable=False),
        sa.Column("description", sa.String, nullable=True),
        sa.Column("date", sa.String, nullable=False),
        sa.Column("method", sa.String, nullable=True),
        sa.Column("notes", sa.String, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_index("ix_expense_user_id", "expense", ["user_id"])

    op.create_table(
        "income",
        sa.Column("id", sa.String, primary_key=True),
        sa.Column("user_id", sa.String, nullable=False),
        sa.Column("amount", sa.Float, nullable=False),
        sa.Column("date", sa.String, nullable=False),
        sa.Column("description", sa.String, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_index("ix_income_user_id", "income", ["user_id"])

    op.create_table(
        "budget",
        sa.Column("id", sa.String, primary_key=True),
        sa.Column("user_id", sa.String, nullable=False),
        sa.Column("category", sa.String, nullable=False),
        sa.Column("limit", sa.Float, nullable=False),
        sa.Column("period", sa.String, nullable=False),
        sa.Column("color", sa.String, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_index("ix_budget_user_id", "budget", ["user_id"])

    op.create_table(
        "todo",
        sa.Column("id", sa.String, primary_key=True),
        sa.Column("user_id", sa.String, nullable=False),
        sa.Column("title", sa.String, nullable=False),
        sa.Column("description", sa.String, nullable=True),
        sa.Column("completed", sa.Boolean, nullable=False),
        sa.Column("priority", sa.String, nullable=True),
        sa.Column("category", sa.String, nullable=True),
        sa.Column("due_date", sa.String, nullable=True),
        sa.Column("completed_at", sa.DateTime, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_index("ix_todo_user_id", "todo", ["user_id"])

    op.create_table(
        "meeting",
        sa.Column("id", sa.String, primary_key=True),
        sa.Column("user_id", sa.String, nullable=False),
        sa.Column("title", sa.String, nullable=False),
        sa.Column("start", sa.String, nullable=False),
        sa.Column("end", sa.String, nullable=False),
        sa.Column("organizer", sa.String, nullable=True),
        sa.Column("description", sa.String, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_index("ix_meeting_user_id", "meeting", ["user_id"])

    op.create_table(
        "note",
        sa.Column("id", sa.String, primary_key=True),
        sa.Column("user_id", sa.String, nullable=False),
        sa.Column("text", sa.String, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_index("ix_note_user_id", "note", ["user_id"])

    op.create_table(
        "pomodorosession",
        sa.Column("id", sa.String, primary_key=True),
        sa.Column("user_id", sa.String, nullable=False),
        sa.Column("start", sa.String, nullable=False),
        sa.Column("end", sa.String, nullable=True),
        sa.Column("type", sa.String, nullable=False),
        sa.Column("completed", sa.Boolean, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_index("ix_pomodorosession_user_id", "pomodorosession", ["user_id"])

    op.create_table(
        "userprofile",
        sa.Column("id", sa.String, primary_key=True),
        sa.Column("user_id", sa.String, nullable=False),
        sa.Column("name", sa.String, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_index("ix_userprofile_user_id", "userprofile", ["user_id"])
    op.create_unique_constraint("uq_userprofile_user_id", "userprofile", ["user_id"])


def downgrade() -> None:
    op.drop_table("userprofile")
    op.drop_table("pomodorosession")
    op.drop_table("note")
    op.drop_table("meeting")
    op.drop_table("todo")
    op.drop_table("budget")
    op.drop_table("income")
    op.drop_table("expense")

"""Add Subtasks and Embeddings

Revision ID: e1a95d1e6e8a
Revises: 43bac4f2d62c
Create Date: 2025-04-19 18:59:43.095319

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e1a95d1e6e8a'
down_revision: Union[str, None] = '43bac4f2d62c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('sub_tasks',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('checked', sa.Boolean(), nullable=False),
    sa.Column('checked_at', sa.DateTime(), nullable=True),
    sa.Column('is_pinned', sa.Boolean(), nullable=False),
    sa.Column('is_archived', sa.Boolean(), nullable=False),
    sa.Column('task_id', sa.Uuid(), nullable=False),
    sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('task_versions',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('version', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('completed', sa.Boolean(), nullable=False),
    sa.Column('due_date', sa.DateTime(), nullable=True),
    sa.Column('priority', sa.Integer(), nullable=True),
    sa.Column('is_checked', sa.Boolean(), nullable=False),
    sa.Column('checked_at', sa.DateTime(), nullable=True),
    sa.Column('task_id', sa.Uuid(), nullable=False),
    sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('task_versions')
    op.drop_table('sub_tasks')
    # ### end Alembic commands ###

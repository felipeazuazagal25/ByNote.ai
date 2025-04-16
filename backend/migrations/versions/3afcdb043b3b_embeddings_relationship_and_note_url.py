"""Embeddings relationship and Note Url

Revision ID: 3afcdb043b3b
Revises: 643825ecee12
Create Date: 2025-04-15 19:36:22.096838

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3afcdb043b3b'
down_revision: Union[str, None] = '643825ecee12'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('embeddings', sa.Column('user_id', sa.Uuid(), nullable=False))
    op.create_foreign_key(None, 'embeddings', 'users', ['user_id'], ['id'])
    op.add_column('notes', sa.Column('_urlString', sa.String(), nullable=False))
    op.drop_constraint('notes__slug_key', 'notes', type_='unique')
    op.create_unique_constraint(None, 'notes', ['_urlString'])
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'notes', type_='unique')
    op.create_unique_constraint('notes__slug_key', 'notes', ['_slug'])
    op.drop_column('notes', '_urlString')
    op.drop_constraint(None, 'embeddings', type_='foreignkey')
    op.drop_column('embeddings', 'user_id')
    # ### end Alembic commands ###

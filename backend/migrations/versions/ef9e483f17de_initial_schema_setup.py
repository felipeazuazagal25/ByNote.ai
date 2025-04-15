"""Initial schema setup

Revision ID: ef9e483f17de
Revises: 
Create Date: 2025-04-15 01:45:04.061911

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ef9e483f17de'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


from alembic import op

def upgrade():
    # Install the vector extension
    op.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    # Add tables or other schema here, e.g.:
    # op.create_table('example', sa.Column('id', sa.Integer, primary_key=True))

def downgrade():
    # Optionally remove the extension (if safe for your use case)
    op.execute("DROP EXTENSION IF EXISTS vector;")
    # Drop tables if added

"""add user roles and verification

Revision ID: abc123def456
Revises: eec7814feffc
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'abc123def456'
down_revision = 'eec7814feffc'
branch_labels = None
depends_on = None


def upgrade():
    # Agregar campos nuevos a la tabla users
    op.add_column('users', sa.Column('role', sa.String(length=20), nullable=False, server_default='user'))
    op.add_column('users', sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('users', sa.Column('verification_token', sa.String(), nullable=True))
    op.add_column('users', sa.Column('verification_token_expires', sa.DateTime(), nullable=True))
    op.add_column('users', sa.Column('refresh_token', sa.String(), nullable=True))
    op.add_column('users', sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')))
    op.add_column('users', sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')))
    
    # Actualizar usuarios existentes para que sean admin y verificados
    op.execute("UPDATE users SET role = 'admin', is_verified = true WHERE email = 'admin@example.com'")


def downgrade():
    op.drop_column('users', 'updated_at')
    op.drop_column('users', 'created_at')
    op.drop_column('users', 'refresh_token')
    op.drop_column('users', 'verification_token_expires')
    op.drop_column('users', 'verification_token')
    op.drop_column('users', 'is_verified')
    op.drop_column('users', 'role')



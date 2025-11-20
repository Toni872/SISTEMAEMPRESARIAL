"""Add invoice_registry table for Verifactu

Revision ID: i1234567890d
Revises: h1234567890c
Create Date: 2025-01-XX XX:XX:XX.XXXXXX

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'i1234567890d'
down_revision = 'h1234567890c'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'invoice_registry',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sale_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('hash', sa.String(length=64), nullable=False),
        sa.Column('previous_hash', sa.String(length=64), nullable=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('invoice_data', sa.Text(), nullable=False),
        sa.Column('xml_path', sa.String(length=500), nullable=True),
        sa.Column('sent_to_aeat', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('sent_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('qr_code', sa.Text(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['sale_id'], ['sales.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('hash'),
        sa.UniqueConstraint('sale_id')
    )
    op.create_index(op.f('ix_invoice_registry_id'), 'invoice_registry', ['id'], unique=False)
    op.create_index(op.f('ix_invoice_registry_sale_id'), 'invoice_registry', ['sale_id'], unique=True)
    op.create_index(op.f('ix_invoice_registry_hash'), 'invoice_registry', ['hash'], unique=True)
    op.create_index(op.f('ix_invoice_registry_previous_hash'), 'invoice_registry', ['previous_hash'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_invoice_registry_previous_hash'), table_name='invoice_registry')
    op.drop_index(op.f('ix_invoice_registry_hash'), table_name='invoice_registry')
    op.drop_index(op.f('ix_invoice_registry_sale_id'), table_name='invoice_registry')
    op.drop_index(op.f('ix_invoice_registry_id'), table_name='invoice_registry')
    op.drop_table('invoice_registry')


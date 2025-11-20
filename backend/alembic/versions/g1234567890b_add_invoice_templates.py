"""add invoice templates

Revision ID: g1234567890b
Revises: f1234567890a
Create Date: 2025-11-19 19:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'g1234567890b'
down_revision = 'f1234567890a'
branch_labels = None
depends_on = None


def upgrade():
    # Crear tabla invoice_templates
    op.create_table(
        'invoice_templates',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('html_template', sa.Text(), nullable=False),
        sa.Column('header_color', sa.String(length=7), nullable=True, server_default='#3b82f6'),
        sa.Column('footer_text', sa.Text(), nullable=True),
        sa.Column('logo_url', sa.String(length=500), nullable=True),
        sa.Column('show_tax_breakdown', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('show_payment_terms', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('show_notes', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_default', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_system', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_invoice_templates_id'), 'invoice_templates', ['id'], unique=False)
    op.create_index('ix_invoice_templates_user_id', 'invoice_templates', ['user_id'], unique=False)
    op.create_index('ix_invoice_templates_is_default', 'invoice_templates', ['is_default'], unique=False)


def downgrade():
    op.drop_index('ix_invoice_templates_is_default', table_name='invoice_templates')
    op.drop_index('ix_invoice_templates_user_id', table_name='invoice_templates')
    op.drop_index(op.f('ix_invoice_templates_id'), table_name='invoice_templates')
    op.drop_table('invoice_templates')


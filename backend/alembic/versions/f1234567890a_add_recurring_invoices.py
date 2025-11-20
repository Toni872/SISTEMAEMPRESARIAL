"""add recurring invoices

Revision ID: f1234567890a
Revises: abc123def456
Create Date: 2025-11-19 18:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'f1234567890a'
down_revision = 'abc123def456'
branch_labels = None
depends_on = None


def upgrade():
    # Crear tabla recurring_invoices primero (necesaria para el foreign key)
    op.create_table(
        'recurring_invoices',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('customer_name', sa.String(length=200), nullable=True),
        sa.Column('customer_email', sa.String(length=200), nullable=True),
        sa.Column('customer_phone', sa.String(length=50), nullable=True),
        sa.Column('frequency', sa.String(length=50), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.Column('next_run_date', sa.Date(), nullable=False),
        sa.Column('day_of_month', sa.Integer(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('total_invoices_generated', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='fk_recurring_invoices_user_id')
    )
    op.create_index(op.f('ix_recurring_invoices_id'), 'recurring_invoices', ['id'], unique=False)
    
    # Crear tabla recurring_invoice_items
    op.create_table(
        'recurring_invoice_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('recurring_invoice_id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('unit_price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('description', sa.String(length=500), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['recurring_invoice_id'], ['recurring_invoices.id'], name='fk_recurring_invoice_items_recurring_invoice_id'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], name='fk_recurring_invoice_items_product_id')
    )
    op.create_index(op.f('ix_recurring_invoice_items_id'), 'recurring_invoice_items', ['id'], unique=False)
    
    # Agregar columna recurring_invoice_id a sales (después de crear la tabla)
    op.add_column('sales', sa.Column('recurring_invoice_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_sales_recurring_invoice_id',
        'sales',
        'recurring_invoices',
        ['recurring_invoice_id'],
        ['id']
    )


def downgrade():
    # Eliminar foreign key y columna de sales
    op.drop_constraint('fk_sales_recurring_invoice_id', 'sales', type_='foreignkey')
    op.drop_column('sales', 'recurring_invoice_id')
    
    # Eliminar tablas
    op.drop_index(op.f('ix_recurring_invoice_items_id'), table_name='recurring_invoice_items')
    op.drop_table('recurring_invoice_items')
    op.drop_index(op.f('ix_recurring_invoices_id'), table_name='recurring_invoices')
    op.drop_table('recurring_invoices')


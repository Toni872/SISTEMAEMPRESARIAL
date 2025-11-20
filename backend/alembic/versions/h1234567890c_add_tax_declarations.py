"""add tax declarations

Revision ID: h1234567890c
Revises: g1234567890b
Create Date: 2025-11-19 20:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'h1234567890c'
down_revision = 'g1234567890b'
branch_labels = None
depends_on = None


def upgrade():
    # Crear enum para tipos de modelo fiscal
    op.execute("CREATE TYPE taxmodeltype AS ENUM ('303', '111', '130', '347')")
    op.execute("CREATE TYPE taxdeclarationstatus AS ENUM ('draft', 'calculated', 'generated', 'submitted', 'accepted', 'rejected')")
    
    # Crear tabla tax_declarations
    op.create_table(
        'tax_declarations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('model_type', sa.Enum('303', '111', '130', '347', name='taxmodeltype'), nullable=False),
        sa.Column('period_quarter', sa.Integer(), nullable=True),
        sa.Column('period_year', sa.Integer(), nullable=False),
        sa.Column('period_start_date', sa.Date(), nullable=False),
        sa.Column('period_end_date', sa.Date(), nullable=False),
        sa.Column('status', sa.Enum('draft', 'calculated', 'generated', 'submitted', 'accepted', 'rejected', name='taxdeclarationstatus'), nullable=False, server_default='draft'),
        sa.Column('declaration_data', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('submitted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('response_data', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('reference_number', sa.String(length=50), nullable=True),
        sa.Column('pdf_path', sa.String(length=500), nullable=True),
        sa.Column('xml_path', sa.String(length=500), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('is_rectification', sa.String(length=10), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tax_declarations_id'), 'tax_declarations', ['id'], unique=False)
    op.create_index('ix_tax_declarations_user_id', 'tax_declarations', ['user_id'], unique=False)
    op.create_index('ix_tax_declarations_model_type', 'tax_declarations', ['model_type'], unique=False)
    op.create_index('ix_tax_declarations_period', 'tax_declarations', ['period_year', 'period_quarter'], unique=False)


def downgrade():
    op.drop_index('ix_tax_declarations_period', table_name='tax_declarations')
    op.drop_index('ix_tax_declarations_model_type', table_name='tax_declarations')
    op.drop_index('ix_tax_declarations_user_id', table_name='tax_declarations')
    op.drop_index(op.f('ix_tax_declarations_id'), table_name='tax_declarations')
    op.drop_table('tax_declarations')
    op.execute("DROP TYPE taxdeclarationstatus")
    op.execute("DROP TYPE taxmodeltype")


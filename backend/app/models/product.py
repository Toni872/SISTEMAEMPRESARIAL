from sqlalchemy import Column, Integer, String, Numeric, Text, Boolean
from ..core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    sku = Column(String(100), unique=True, index=True, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    cost = Column(Numeric(10, 2), nullable=True)  # Costo para calcular ganancia
    stock = Column(Integer, default=0, nullable=False)
    min_stock = Column(Integer, default=0, nullable=False)  # Stock mínimo para alertas
    category = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)




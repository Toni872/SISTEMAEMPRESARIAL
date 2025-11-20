from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.supplier import Supplier


def get_supplier(db: Session, supplier_id: int, user_id: int) -> Optional[Supplier]:
    """Obtiene un proveedor por ID"""
    return db.query(Supplier).filter(
        Supplier.id == supplier_id,
        Supplier.user_id == user_id
    ).first()


def get_suppliers(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Supplier]:
    """Lista los proveedores de un usuario"""
    return db.query(Supplier).filter(
        Supplier.user_id == user_id
    ).offset(skip).limit(limit).all()


def create_supplier(db: Session, supplier_data: dict, user_id: int) -> Supplier:
    """Crea un nuevo proveedor"""
    supplier = Supplier(**supplier_data, user_id=user_id)
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier


def update_supplier(db: Session, supplier_id: int, user_id: int, supplier_data: dict) -> Optional[Supplier]:
    """Actualiza un proveedor"""
    supplier = get_supplier(db, supplier_id, user_id)
    if not supplier:
        return None
    
    for key, value in supplier_data.items():
        if value is not None:
            setattr(supplier, key, value)
    
    db.commit()
    db.refresh(supplier)
    return supplier


def delete_supplier(db: Session, supplier_id: int, user_id: int) -> bool:
    """Elimina un proveedor"""
    supplier = get_supplier(db, supplier_id, user_id)
    if not supplier:
        return False
    
    db.delete(supplier)
    db.commit()
    return True


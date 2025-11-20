#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Resetear contraseña del usuario de prueba"""
import sys
import os

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def main():
    db = SessionLocal()
    try:
        # Buscar usuario
        user = db.query(User).filter(User.email == 'test@example.com').first()

        if not user:
            print("❌ Usuario no encontrado")
            return

        # Actualizar contraseña
        user.hashed_password = get_password_hash('testpassword123')
        user.is_active = True
        user.is_verified = True
        db.commit()
        db.refresh(user)
        
        print(f"✅ Contraseña actualizada exitosamente!")
        print(f"   Email: {user.email}")
        print(f"   ID: {user.id}")
        print(f"   Contraseña: testpassword123")
        print(f"   Activo: {user.is_active}")
        print(f"   Verificado: {user.is_verified}")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()



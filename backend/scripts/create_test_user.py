#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Crear usuario de prueba si no existe"""
import sys
import os

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()

try:
    # Verificar si existe
    existing = db.query(User).filter(User.email == 'test@example.com').first()

    if existing:
        print(f"✅ Usuario ya existe: {existing.email}")
        print(f"   ID: {existing.id}")
    else:
        # Crear usuario
        hashed_password = get_password_hash('testpassword123')
        user = User(
            email='test@example.com',
            hashed_password=hashed_password,
            name='Usuario Prueba',
            role='ADMIN',
            is_active=True,
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"✅ Usuario creado: {user.email} (ID: {user.id})")
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()



"""
Script para poblar la base de datos con datos iniciales
"""
from datetime import datetime, timedelta
from app.core.database import get_db
from app.crud.user import create_user, get_user_by_email, verify_user_email
from app.api.auth.schemas import UserCreate
from app.core.security import get_password_hash


def seed_database():
    """Poblar la base de datos con usuarios iniciales"""
    db = next(get_db())
    try:
        # Verificar si el usuario admin ya existe
        existing_admin = get_user_by_email(db, "admin@example.com")
        if existing_admin:
            print("[INFO] Usuario admin@example.com ya existe. Actualizando a admin y verificando.")
            existing_admin.role = "admin"
            existing_admin.is_verified = True
            db.commit()
            return

        # Crear usuario admin
        user_data = UserCreate(
            email="admin@example.com",
            name="Admin",
            password="admin1234"
        )
        hashed_password = get_password_hash("admin1234")
        admin_user = create_user(
            db, 
            user_data, 
            hashed_password,
            role="admin",
            verification_token=None,
            token_expires=None
        )
        # Verificar email automáticamente para admin
        verify_user_email(db, admin_user.id)
        
        # Crear usuario normal
        user_data_normal = UserCreate(
            email="user@example.com",
            name="Usuario",
            password="user1234"
        )
        hashed_password_normal = get_password_hash("user1234")
        create_user(
            db,
            user_data_normal,
            hashed_password_normal,
            role="user"
        )
        
        print("[OK] Seed completed successfully")
        print("   Admin creado: admin@example.com / admin1234 (role: admin, verified)")
        print("   Usuario creado: user@example.com / user1234 (role: user)")
    except Exception as e:
        print(f"[ERROR] Error durante seed: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

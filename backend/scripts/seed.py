"""
Script para poblar la base de datos con datos iniciales
"""
from app.core.database import get_db
from app.crud.user import create_user, get_user_by_email
from app.api.auth.schemas import UserCreate
from app.core.security import get_password_hash


def seed_database():
    """Poblar la base de datos con usuarios iniciales"""
    db = next(get_db())
    try:
        # Verificar si el usuario admin ya existe
        existing_admin = get_user_by_email(db, "admin@example.com")
        if existing_admin:
            print("⚠️  Usuario admin@example.com ya existe. Saltando seed.")
            return

        # Crear usuario admin
        user_data = UserCreate(
            email="admin@example.com",
            name="Admin",
            password="admin1234"
        )
        hashed_password = get_password_hash("admin1234")
        create_user(db, user_data, hashed_password)
        print("✅ Seed completed successfully")
        print("   Usuario creado: admin@example.com / admin1234")
    except Exception as e:
        print(f"❌ Error durante seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

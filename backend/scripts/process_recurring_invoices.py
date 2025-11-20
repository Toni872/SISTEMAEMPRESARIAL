"""
Script para procesar facturas recurrentes automáticamente
Este script debe ejecutarse diariamente mediante un cron job o scheduler

Ejemplo de cron (ejecutar todos los días a las 2 AM):
0 2 * * * cd /path/to/backend && python scripts/process_recurring_invoices.py
"""
import sys
import os

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.crud.recurring_invoice import process_due_recurring_invoices


def main():
    """Procesa todas las facturas recurrentes vencidas"""
    db: Session = SessionLocal()
    try:
        print("Iniciando procesamiento de facturas recurrentes...")
        stats = process_due_recurring_invoices(db)
        
        print(f"\nProcesamiento completado:")
        print(f"  - Procesadas: {stats['processed']}")
        print(f"  - Generadas: {stats['generated']}")
        print(f"  - Errores: {stats['errors']}")
        print(f"  - Expiradas: {stats['expired']}")
        
        if stats['generated'] > 0:
            print(f"\n✅ {stats['generated']} facturas generadas exitosamente")
        
        if stats['errors'] > 0:
            print(f"⚠️  {stats['errors']} errores durante el procesamiento")
        
        return 0
    except Exception as e:
        print(f"❌ Error procesando facturas recurrentes: {e}")
        return 1
    finally:
        db.close()


if __name__ == "__main__":
    exit(main())


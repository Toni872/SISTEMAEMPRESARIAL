# Makefile para facilitar comandos comunes

.PHONY: help test test-cov run dev up down logs clean

help:
	@echo "Comandos disponibles:"
	@echo "  make test       - Ejecutar tests"
	@echo "  make test-cov   - Ejecutar tests con cobertura"
	@echo "  make run        - Ejecutar servidor localmente"
	@echo "  make dev        - Ejecutar servidor en modo desarrollo"
	@echo "  make up         - Levantar contenedores Docker"
	@echo "  make down       - Detener contenedores Docker"
	@echo "  make logs       - Ver logs de Docker"
	@echo "  make clean      - Limpiar archivos temporales"

test:
	pytest tests/ -v

test-cov:
	pytest tests/ --cov=app --cov-report=html --cov-report=term

run:
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

dev:
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --log-level debug

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f web

clean:
	find . -type d -name __pycache__ -exec rm -r {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name "*.egg-info" -exec rm -r {} +
	rm -rf .pytest_cache
	rm -rf .coverage
	rm -rf htmlcov


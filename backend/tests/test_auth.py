import pytest
from httpx import AsyncClient, ASGITransport

from app.main import app


@pytest.mark.asyncio
async def test_register_and_login():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Register
        r = await ac.post(
            "/api/auth/register",
            json={
                "email": "john.doe@example.com",
                "name": "John",
                "password": "supersecret",
            },
        )
        assert r.status_code == 201
        data = r.json()
        assert data["email"] == "john.doe@example.com"
        assert data["name"] == "John"
        assert "id" in data

        # Login
        r = await ac.post(
            "/api/auth/login",
            json={
                "email": "john.doe@example.com",
                "password": "supersecret",
            },
        )
        assert r.status_code == 200
        response_data = r.json()
        assert "access_token" in response_data
        assert response_data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_register_duplicate_email():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # First registration
        r = await ac.post(
            "/api/auth/register",
            json={
                "email": "duplicate@example.com",
                "name": "First User",
                "password": "password123",
            },
        )
        assert r.status_code == 201

        # Try to register again with same email
        r = await ac.post(
            "/api/auth/register",
            json={
                "email": "duplicate@example.com",
                "name": "Second User",
                "password": "password456",
            },
        )
        assert r.status_code == 409
        assert "already registered" in r.json()["detail"].lower()


@pytest.mark.asyncio
async def test_login_invalid_credentials():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Register a user first
        r = await ac.post(
            "/api/auth/register",
            json={
                "email": "test@example.com",
                "name": "Test User",
                "password": "correctpassword",
            },
        )
        assert r.status_code == 201

        # Try to login with wrong password
        r = await ac.post(
            "/api/auth/login",
            json={
                "email": "test@example.com",
                "password": "wrongpassword",
            },
        )
        assert r.status_code == 401
        assert "incorrect" in r.json()["detail"].lower()

        # Try to login with non-existent email
        r = await ac.post(
            "/api/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "anypassword",
            },
        )
        assert r.status_code == 401

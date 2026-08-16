from sqlmodel import create_engine, Session, SQLModel
from app import app, get_session
from fastapi.testclient import TestClient
import os
import pytest

DATABASE = os.environ["TEST_DB_URL"]
engine = create_engine(DATABASE, echo=True)
SQLModel.metadata.create_all(engine)

#Guarding prod/dev database
if "test" not in DATABASE:
    raise RuntimeError(f"Refusing to run tests against {DATABASE}")

@pytest.fixture(name="session")
def session_fixture():
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(name="client")
def client_fixture(session):
    app.dependency_overrides[get_session] = lambda: session
    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()

@pytest.fixture
def make_user(client):
    def _make(username: str):
        client.post("/users/", json={"username": username, "password": "Testpass1!"})
        res = client.post("/auth/login", json={"username": username, "password": "Testpass1!"})
        return {"Authorization": f"Bearer {res.json()['access_token']}"}
    return _make

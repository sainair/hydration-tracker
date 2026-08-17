from sqlmodel import create_engine, Session, SQLModel, select
from app import app, get_session, Habits
from fastapi.testclient import TestClient
import os
import pytest

DATABASE = os.environ["TEST_DB_URL"]

#Guarding prod/dev database
if "test" not in DATABASE:
    raise RuntimeError(f"Refusing to run tests against {DATABASE}")

engine = create_engine(DATABASE)
SQLModel.metadata.create_all(engine)

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
def make_user(client, session):
    def _make(username: str):
        password = "Testpass1!"
        r = client.post("/users/", json={"username":username, "password":password})
        assert r.status_code == 200, r.text

        res = client.post("/auth/login", json={"username":username, "password":password})
        assert res.status_code == 200, res.text

        user_id = r.json()["id"]
        habit = session.exec(select(Habits).where(Habits.user_id == user_id)).first()

        return {"headers":{"Authorization":f"Bearer {res.json()['access_token']}"}, "habit_id": habit.id}
    return _make

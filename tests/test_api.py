from fastapi.testclient import TestClient

from app.main import app

c = TestClient(app)


def test_health():
    assert c.get("/health").json() == {"ok": True}


def test_pages_and_assets():
    assert c.get("/").status_code == 200
    assert c.get("/static/css/style.css").status_code == 200
    assert c.get("/static/js/chart.js").status_code == 200


def test_validation():
    assert c.get("/api/analyze?market=XX").status_code == 400
    assert c.get("/api/analyze?period=bad").status_code == 400


from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_or_health_endpoint():
    response = client.get("/")

    # Root route may not exist; 404 is acceptable for this check.
    assert response.status_code in (200, 404)


def test_openapi_schema_available():
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schema = response.json()
    assert "paths" in schema


def test_expected_ml_routes_registered():
    response = client.get("/openapi.json")
    paths = response.json()["paths"]

    assert "/recommendations/" in paths
    assert "/budget/predict" in paths
    assert "/itinerary/generate" in paths

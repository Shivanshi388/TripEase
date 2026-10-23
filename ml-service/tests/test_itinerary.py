
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


@patch("app.api.routes.itinerary.generate_itinerary")
def test_itinerary_success(mock_generate):
    mock_generate.return_value = {
        "destination_id": "D001",
        "itinerary": [{"day": 1, "activities": ["Beach Visit"]}],
    }

    response = client.post(
        "/itinerary/generate",
        json={
            "destination_id": "D001",
            "days": 3,
            "budget_per_day": 1500,
        },
    )

    assert response.status_code == 200
    assert response.json()["destination_id"] == "D001"
    mock_generate.assert_called_once_with(
        destination_id="D001",
        days=3,
        budget_per_day=1500,
    )


def test_itinerary_invalid_days():
    response = client.post(
        "/itinerary/generate",
        json={"destination_id": "D001", "days": 0},
    )

    assert response.status_code == 422


@patch("app.api.routes.itinerary.generate_itinerary")
def test_itinerary_value_error(mock_generate):
    mock_generate.side_effect = ValueError("Unknown destination")

    response = client.post(
        "/itinerary/generate",
        json={"destination_id": "INVALID", "days": 2},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Unknown destination"


@patch("app.api.routes.itinerary.generate_itinerary")
def test_itinerary_file_not_found(mock_generate):
    mock_generate.side_effect = FileNotFoundError("Dataset missing")

    response = client.post(
        "/itinerary/generate",
        json={"destination_id": "D001", "days": 2},
    )

    assert response.status_code == 500
    assert response.json()["detail"] == "Dataset missing"

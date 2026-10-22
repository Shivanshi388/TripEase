
from fastapi.testclient import TestClient
from unittest.mock import patch

from app.main import app

client = TestClient(app)


@patch(
    "app.api.routes.recommendation.recommend_destinations"
)
def test_recommendations_success(mock_recommend):
    mock_recommend.return_value = [
        {"destination_id": "D001", "name": "Goa"},
        {"destination_id": "D002", "name": "Manali"},
    ]

    response = client.post(
        "/recommendations/",
        json={
            "category": "beach",
            "max_daily_cost": 2000,
            "season": "summer",
            "top_n": 2,
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 2
    assert len(data["recommendations"]) == 2
    mock_recommend.assert_called_once_with(
        category="beach",
        max_daily_cost=2000,
        season="summer",
        top_n=2,
    )


def test_recommendations_invalid_top_n():
    response = client.post(
        "/recommendations/",
        json={"top_n": 0},
    )

    assert response.status_code == 422


def test_recommendations_invalid_max_daily_cost():
    response = client.post(
        "/recommendations/",
        json={"max_daily_cost": 0},
    )

    assert response.status_code == 422


@patch(
    "app.api.routes.recommendation.recommend_destinations"
)
def test_recommendations_value_error(mock_recommend):
    mock_recommend.side_effect = ValueError("Invalid filter")

    response = client.post(
        "/recommendations/",
        json={},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid filter"

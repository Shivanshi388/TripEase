import sys
import os

# Add ml-service to Python path
ML_SERVICE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

sys.path.insert(0, ML_SERVICE_PATH)

# Import budget prediction service
from app.services.prediction_service import get_budget_prediction


def test_budget_prediction():

    result = get_budget_prediction(
        destination_id="D001",
        days=3,
        travelers=2
    )

    print("\n==============================")
    print("     BUDGET PREDICTION TEST")
    print("==============================")

    print("Destination:", result["destination_id"])
    print("Days:", result["days"])
    print("Travelers:", result["travelers"])
    print("Predicted Budget:", result["predicted_budget"])

    # Check that prediction is positive
    assert result["predicted_budget"] > 0

    print("\nTest PASSED!")


if __name__ == "__main__":
    test_budget_prediction()
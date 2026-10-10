import os
import joblib
import pandas as pd


# =========================================================
# 1. FIND MODEL PATH
# =========================================================

# Current file:
# TripEase/ml-service/app/models/budget_predictor.py

# Go from models → app
APP_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

# Go from app → ml-service
ML_SERVICE_PATH = os.path.abspath(
    os.path.join(APP_PATH, "..")
)

# Model location
MODEL_PATH = os.path.join(
    ML_SERVICE_PATH,
    "saved_model",
    "budget_model.pkl"
)


# =========================================================
# 2. LOAD MODEL
# =========================================================

model = joblib.load(MODEL_PATH)


# =========================================================
# 3. PREDICT BUDGET
# =========================================================

def predict_budget(
    destination_id,
    days,
    travelers
):
    """
    Predict the total trip cost.
    """

    # Create input DataFrame
    input_data = pd.DataFrame({
        "destination_id": [destination_id],
        "days": [days],
        "travelers": [travelers]
    })

    # Make prediction
    prediction = model.predict(input_data)

    # Return single predicted value
    return round(float(prediction[0]), 2)
if __name__ == "__main__":

    predicted_budget = predict_budget(
        destination_id="D001",
        days=3,
        travelers=2
    )

    print("Predicted Budget:", predicted_budget)
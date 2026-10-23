from pathlib import Path

import pandas as pd
from app.models.destination_recommender import DestinationRecommender


PROJECT_ROOT = Path(__file__).resolve().parents[3]
MODEL_PATH = PROJECT_ROOT / "data" / "processed" / "encoded_features.csv"
DESTINATIONS_PATH = PROJECT_ROOT / "data" / "raw" / "destinations.csv"

recommender = DestinationRecommender(MODEL_PATH)


def get_recommendations(budget, interests, duration, travellers):
    recommendations = recommender.recommend(
        budget=budget,
        interests=interests,
        duration=duration,
        travellers=travellers,
        top_n=5
    )

    destinations = pd.read_csv(DESTINATIONS_PATH)

    for recommendation in recommendations:
        destination_id = recommendation["destination_id"]

        match = destinations[
            destinations["destination_id"] == destination_id
        ]

        if not match.empty:
            recommendation["destination"] = match.iloc[0]["name"]

    return recommendations
from pathlib import Path

from app.models.destination_recommender import DestinationRecommender


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = PROJECT_ROOT / "data" / "processed" / "encoded_features.csv"


def train():
    recommender = DestinationRecommender(DATA_PATH)

    print("Recommendation model initialized successfully.")
    print(f"Loaded {len(recommender.data)} destinations.")


if __name__ == "__main__":
    train()
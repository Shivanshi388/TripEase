from app.models.destination_recommender import DestinationRecommender


DATA_PATH = "data/processed/encoded_features.csv"


def train():
    recommender = DestinationRecommender(DATA_PATH)

    print("Recommendation model initialized successfully.")
    print(f"Loaded {len(recommender.data)} destinations.")


if __name__ == "__main__":
    train()
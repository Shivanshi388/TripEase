import pandas as pd


INPUT_FILE = "data/processed/cleaned_destinations.csv"
OUTPUT_FILE = "data/raw/destination_features.csv"


def create_features():
    df = pd.read_csv(INPUT_FILE)

    feature_columns = [
        "destination_id",
        "category",
        "best_season",
        "avg_daily_cost",
        "rating",
        "popularity",
    ]

    features = df[feature_columns].copy()

    categories = [
        "Beach",
        "Mountains",
        "Heritage",
        "Adventure",
        "Nature",
        "Spiritual",
        "City",
        "Culture",
        "Backwaters",
    ]

    for category in categories:
        features[category.lower()] = (
            features["category"].str.lower() == category.lower()
        ).astype(int)

    features.to_csv(OUTPUT_FILE, index=False)

    return features


if __name__ == "__main__":
    create_features()
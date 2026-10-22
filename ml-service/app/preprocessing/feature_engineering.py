
from pathlib import Path

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[3]
INPUT_FILE = PROJECT_ROOT / "data" / "processed" / "cleaned_destinations.csv"
OUTPUT_FILE = PROJECT_ROOT / "data" / "raw" / "destination_features.csv"


def create_features(df):
    """Standardize column names in a TripEase dataset."""
    df = df.copy()
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )
    return df


def build_destination_features(df):
    """Create numerical preference features from destination categories."""
    df = create_features(df)

    required_columns = [
        "destination_id",
        "category",
        "best_season",
        "avg_daily_cost",
        "rating",
        "popularity",
    ]
    missing_columns = [
        column for column in required_columns if column not in df.columns
    ]
    if missing_columns:
        raise ValueError(f"Destination data is missing columns: {missing_columns}")

    features = df[required_columns].copy()

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
            features["category"].astype(str).str.lower() == category.lower()
        ).astype(int)

    return features


def create_destination_features():
    """Read cleaned destinations and save their engineered features."""
    df = pd.read_csv(INPUT_FILE)
    features = build_destination_features(df)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    features.to_csv(OUTPUT_FILE, index=False)

    return features


if __name__ == "__main__":
    create_destination_features()

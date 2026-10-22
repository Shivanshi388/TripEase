
from pathlib import Path

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[3]
INPUT_FILE = PROJECT_ROOT / "data" / "raw" / "destination_features.csv"
OUTPUT_FILE = PROJECT_ROOT / "data" / "processed" / "encoded_features.csv"


def encode_data(df):
    """Convert categorical columns into numerical features."""
    df = df.copy()

    categorical_columns = df.select_dtypes(
        include=["object", "category"]
    ).columns

    df = pd.get_dummies(
        df,
        columns=categorical_columns,
        drop_first=True,
        dtype=int,
    )

    return df


def encode_features():
    """Select and save the numerical features used by the recommender."""
    df = pd.read_csv(INPUT_FILE)

    feature_columns = [
        "avg_daily_cost",
        "rating",
        "popularity",
        "beach",
        "mountains",
        "heritage",
        "adventure",
        "nature",
        "spiritual",
        "city",
        "culture",
        "backwaters",
    ]

    required_columns = ["destination_id"] + feature_columns
    missing_columns = [
        column for column in required_columns if column not in df.columns
    ]
    if missing_columns:
        raise ValueError(f"Destination features are missing columns: {missing_columns}")

    encoded = df[required_columns].copy()

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    encoded.to_csv(OUTPUT_FILE, index=False)

    return encoded


if __name__ == "__main__":
    encode_features()

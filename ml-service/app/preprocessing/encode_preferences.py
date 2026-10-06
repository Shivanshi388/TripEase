import pandas as pd


INPUT_FILE = "data/raw/destination_features.csv"
OUTPUT_FILE = "data/processed/encoded_features.csv"


def encode_features():
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

    encoded = df[["destination_id"] + feature_columns].copy()

    encoded.to_csv(OUTPUT_FILE, index=False)

    return encoded


if __name__ == "__main__":
    encode_features()
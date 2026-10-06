import pandas as pd


INPUT_FILE = "data/raw/destinations.csv"
OUTPUT_FILE = "data/processed/cleaned_destinations.csv"


def clean_destinations():
    df = pd.read_csv(INPUT_FILE)

    df = df.drop_duplicates(subset=["destination_id"])

    required_columns = [
        "destination_id",
        "name",
        "category",
        "best_season",
        "avg_daily_cost",
        "rating",
        "popularity",
        "latitude",
        "longitude",
    ]

    df = df[required_columns]

    df = df.dropna()

    df.to_csv(OUTPUT_FILE, index=False)

    return df


if __name__ == "__main__":
    clean_destinations()
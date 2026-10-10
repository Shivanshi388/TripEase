
import os
import pandas as pd


# Find the project root and dataset path
APP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_SERVICE_PATH = os.path.dirname(APP_PATH)
PROJECT_ROOT = os.path.dirname(ML_SERVICE_PATH)

DATA_PATH = os.path.join(
    PROJECT_ROOT, "data", "raw", "destinations.csv"
)


def recommend_destinations(
    category=None,
    max_daily_cost=None,
    season=None,
    top_n=5
):
    """Recommend destinations using user preferences."""

    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(
            f"Destination dataset not found: {DATA_PATH}"
        )

    df = pd.read_csv(DATA_PATH)

    # Standardize column names
    df.columns = (
        df.columns.str.strip().str.lower().str.replace(" ", "_")
    )

    # Filter by category, if provided
    if category:
        df = df[
            df["category"].str.contains(
                category, case=False, na=False
            )
        ]

    # Filter by maximum daily budget, if provided
    if max_daily_cost is not None:
        df = df[df["avg_daily_cost"] <= max_daily_cost]

    # Filter by season, if provided
    if season:
        df = df[
            df["best_season"].str.contains(
                season, case=False, na=False
            )
        ]

    # Rank remaining destinations by rating and popularity
    df = df.sort_values(
        by=["rating", "popularity"],
        ascending=False
    )

    # Return useful fields only
    columns = [
        "destination_id",
        "name",
        "country",
        "state",
        "category",
        "best_season",
        "avg_daily_cost",
        "rating",
        "popularity"
    ]

    return df[columns].head(max(1, top_n)).to_dict(
        orient="records"
    )


if __name__ == "__main__":
    results = recommend_destinations(
        category="Beach",
        max_daily_cost=3000,
        top_n=5
    )

    for destination in results:
        print(destination)

from pathlib import Path

import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler


PROJECT_ROOT = Path(__file__).resolve().parents[3]
RAW_DATA_PATH = PROJECT_ROOT / "data" / "raw" / "destinations.csv"


class DestinationRecommender:
    """Content-based destination recommender using cosine similarity."""

    def __init__(self, data_path):
        self.data = pd.read_csv(data_path)

        self.feature_columns = [
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

        missing = [
            column for column in self.feature_columns
            if column not in self.data.columns
        ]
        if missing:
            raise ValueError(
                f"Dataset is missing feature columns: {missing}"
            )

        self.scaler = StandardScaler()
        self.features = self.scaler.fit_transform(
            self.data[self.feature_columns]
        )

    def recommend(
        self, budget, interests, duration, travellers, top_n=5
    ):
        if duration <= 0 or travellers <= 0:
            raise ValueError(
                "Duration and travellers must be greater than zero."
            )

        daily_budget = budget / duration
        interests = [interest.strip().lower() for interest in interests]

        user_vector = []
        interest_features = self.feature_columns[3:]

        for feature in self.feature_columns:
            if feature == "avg_daily_cost":
                user_vector.append(daily_budget)
            elif feature == "rating":
                user_vector.append(self.data["rating"].mean())
            elif feature == "popularity":
                user_vector.append(self.data["popularity"].mean())
            elif feature in interest_features:
                user_vector.append(
                    1 if feature in interests else 0
                )
            else:
                user_vector.append(0)

        scaled_user = self.scaler.transform([user_vector])
        scores = cosine_similarity(
            scaled_user, self.features
        )[0]

        results = self.data.copy()
        results["score"] = scores

        return (
            results.sort_values("score", ascending=False)
            .head(top_n)[["destination_id", "score"]]
            .to_dict(orient="records")
        )


def recommend_destinations(
    category=None,
    max_daily_cost=None,
    season=None,
    top_n=5,
):
    """Filter and rank destinations using general preferences."""

    if not RAW_DATA_PATH.exists():
        raise FileNotFoundError(
            f"Destination dataset not found: {RAW_DATA_PATH}"
        )

    df = pd.read_csv(RAW_DATA_PATH)
    df.columns = (
        df.columns.str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    if category and "category" in df.columns:
        df = df[
            df["category"].astype(str).str.contains(
                category, case=False, na=False
            )
        ]

    if max_daily_cost is not None:
        if "avg_daily_cost" not in df.columns:
            raise ValueError(
                "Dataset does not contain avg_daily_cost."
            )
        df = df[df["avg_daily_cost"] <= max_daily_cost]

    if season and "best_season" in df.columns:
        df = df[
            df["best_season"].astype(str).str.contains(
                season, case=False, na=False
            )
        ]

    ranking_columns = [
        column for column in ["rating", "popularity"]
        if column in df.columns
    ]

    if ranking_columns:
        df = df.sort_values(
            by=ranking_columns,
            ascending=False,
        )

    output_columns = [
        column for column in [
            "destination_id",
            "name",
            "country",
            "state",
            "category",
            "best_season",
            "avg_daily_cost",
            "rating",
            "popularity",
        ]
        if column in df.columns
    ]

    return df[output_columns].head(max(1, top_n)).to_dict(
        orient="records"
    )

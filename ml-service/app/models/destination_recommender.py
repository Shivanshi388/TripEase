
from pathlib import Path
import re

import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler


PROJECT_ROOT = Path(__file__).resolve().parents[3]
RAW_DATA_PATH = PROJECT_ROOT / "data" / "raw" / "destinations.csv"

_MONTH_ALIASES = {
    "jan": 1, "january": 1, "feb": 2, "february": 2,
    "mar": 3, "march": 3, "apr": 4, "april": 4,
    "may": 5, "jun": 6, "june": 6, "jul": 7, "july": 7,
    "aug": 8, "august": 8, "sep": 9, "sept": 9, "september": 9,
    "oct": 10, "october": 10, "nov": 11, "november": 11,
    "dec": 12, "december": 12,
}
_SEASON_MONTHS = {
    "winter": {10, 11, 12, 1, 2},
    "summer": {3, 4, 5, 6},
    "monsoon": {6, 7, 8, 9},
    "rainy": {6, 7, 8, 9},
    "spring": {2, 3, 4},
    "autumn": {9, 10, 11},
    "fall": {9, 10, 11},
}


def _months_in_range(value):
    """Convert values such as 'Nov-Feb' or 'October' to month numbers."""
    tokens = re.findall(r"[A-Za-z]+", str(value or ""))
    months = [_MONTH_ALIASES[token.lower()] for token in tokens if token.lower() in _MONTH_ALIASES]
    if not months:
        return set()
    if len(months) == 1:
        return {months[0]}
    start, end = months[0], months[1]
    result = set()
    current = start
    while True:
        result.add(current)
        if current == end:
            break
        current = current % 12 + 1
    return result


def _requested_season_months(value):
    """Accept season names (summer/winter/monsoon) or month/range values."""
    normalized = str(value or "").strip().lower()
    if normalized in _SEASON_MONTHS:
        return _SEASON_MONTHS[normalized]
    months = _months_in_range(normalized)
    if months:
        return months
    raise ValueError(
        "Season must be summer, winter, monsoon, spring, autumn, or a month/range such as Oct-Mar."
    )


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
        if budget <= 0:
            raise ValueError("Budget must be greater than zero.")
        if duration <= 0 or travellers <= 0:
            raise ValueError(
                "Duration and travellers must be greater than zero."
            )

        # The UI budget is the total for the whole party. Destination costs in
        # the dataset are daily estimates, so compare a per-person daily budget.
        daily_budget = budget / duration / travellers

        # Translate UI wording to the exact binary features in encoded_features.csv.
        aliases = {
            "beach": "beach", "beaches": "beach",
            "mountain": "mountains", "mountains": "mountains",
            "nature": "nature", "adventure": "adventure",
            "heritage": "heritage", "culture": "culture",
            "spiritual": "spiritual", "city": "city",
            "backwater": "backwaters", "backwaters": "backwaters",
        }
        normalized_interests = set()
        for interest in interests or []:
            key = str(interest).strip().lower()
            if key in aliases:
                normalized_interests.add(aliases[key])

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
                user_vector.append(1 if feature in normalized_interests else 0)
            else:
                user_vector.append(0)

        scaled_user = self.scaler.transform(
            pd.DataFrame([user_vector], columns=self.feature_columns)
        )
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
        wanted_months = _requested_season_months(season)
        df = df[
            df["best_season"].map(
                lambda value: bool(wanted_months & _months_in_range(value))
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

import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity


class DestinationRecommender:

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

        self.scaler = StandardScaler()

        self.features = self.scaler.fit_transform(
            self.data[self.feature_columns]
        )

    def recommend(self, budget, interests, duration, travellers, top_n=5):

        daily_budget = budget / duration

        user_vector = []

        for feature in self.feature_columns:

            if feature == "avg_daily_cost":
                user_vector.append(daily_budget)

            elif feature in interests:
                user_vector.append(1)

            elif feature in [
                "beach",
                "mountains",
                "heritage",
                "adventure",
                "nature",
                "spiritual",
                "city",
                "culture",
                "backwaters",
            ]:
                user_vector.append(0)

            elif feature == "rating":
                user_vector.append(self.data["rating"].mean())

            elif feature == "popularity":
                user_vector.append(self.data["popularity"].mean())

            else:
                user_vector.append(0)

        user_vector = self.scaler.transform([user_vector])

        similarities = cosine_similarity(
            user_vector,
            self.features
        )[0]

        self.data["score"] = similarities

        recommendations = (
            self.data
            .sort_values("score", ascending=False)
            .head(top_n)
        )

        return recommendations[
            ["destination_id", "score"]
        ].to_dict(orient="records")
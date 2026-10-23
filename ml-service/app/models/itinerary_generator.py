
import os
import pandas as pd


APP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_SERVICE_PATH = os.path.dirname(APP_PATH)
PROJECT_ROOT = os.path.dirname(ML_SERVICE_PATH)

DESTINATIONS_PATH = os.path.join(
    PROJECT_ROOT, "data", "raw", "destinations.csv"
)
ACTIVITIES_PATH = os.path.join(
    PROJECT_ROOT, "data", "raw", "activities.csv"
)


def generate_itinerary(destination_id, days, budget_per_day=None):
    """Generate an itinerary without repeating activities."""

    if days <= 0:
        raise ValueError("Days must be greater than 0.")

    destinations = pd.read_csv(DESTINATIONS_PATH)
    activities = pd.read_csv(ACTIVITIES_PATH)

    destination_id = destination_id.strip().upper()

    destination = destinations[
        destinations["destination_id"].astype(str).str.upper()
        == destination_id
    ]

    if destination.empty:
        raise ValueError("Destination ID not found.")

    available = activities[
        activities["destination_id"].astype(str).str.upper()
        == destination_id
    ].copy()

    if budget_per_day is not None:
        if budget_per_day <= 0:
            raise ValueError("Budget per day must be greater than 0.")

        available = available[
            available["avg_cost"] <= budget_per_day
        ]

    if available.empty:
        raise ValueError(
            "No activities found for this destination and budget."
        )

    available = available.sort_values(
        by=["rating", "avg_cost"],
        ascending=[False, True]
    ).reset_index(drop=True)

    if days > len(available):
        raise ValueError(
            f"Only {len(available)} unique activities are available "
            f"for {destination_id}; requested {days} days."
        )

    plan = []

    for day in range(1, days + 1):
        activity = available.iloc[day - 1]

        plan.append({
            "day": day,
            "activity_id": activity["activity_id"],
            "activity_name": activity["activity_name"],
            "activity_type": activity["activity_type"],
            "estimated_activity_cost": float(activity["avg_cost"]),
            "duration_hours": float(activity["duration_hours"]),
            "rating": float(activity["rating"])
        })

    return {
        "destination_id": destination_id,
        "destination_name": destination.iloc[0]["name"],
        "days": days,
        "itinerary": plan,
        "estimated_activity_total": round(
            sum(item["estimated_activity_cost"] for item in plan), 2
        )
    }

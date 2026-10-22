import os
import pandas as pd
from app.services.google_maps_service import enrich_itinerary_with_maps

APP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_SERVICE_PATH = os.path.dirname(APP_PATH)
PROJECT_ROOT = os.path.dirname(ML_SERVICE_PATH)

DESTINATIONS_PATH = os.path.join(PROJECT_ROOT, "data", "raw", "destinations.csv")
ACTIVITIES_PATH = os.path.join(PROJECT_ROOT, "data", "raw", "activities.csv")
HOTELS_PATH = os.path.join(PROJECT_ROOT, "data", "raw", "hotels.csv")
TRAVEL_PATH = os.path.join(PROJECT_ROOT, "data", "raw", "travel_costs.csv")


def generate_itinerary(destination_id, days, budget_per_day=None, travel_date=None):
    """Generate a data-backed daily itinerary with hotel and travel estimates."""
    if not isinstance(destination_id, str) or not destination_id.strip():
        raise ValueError("Please select a destination.")

    days = int(days)
    if days < 1 or days > 30:
        raise ValueError("Days must be between 1 and 30.")

    destination_id = destination_id.strip().upper()
    destinations = pd.read_csv(DESTINATIONS_PATH)
    activities = pd.read_csv(ACTIVITIES_PATH)

    destination = destinations[
        destinations["destination_id"].astype(str).str.upper() == destination_id
    ]
    if destination.empty:
        raise ValueError("Destination not found. Please select a destination from the list.")

    destination_row = destination.iloc[0]
    available = activities[
        activities["destination_id"].astype(str).str.upper() == destination_id
    ].copy()

    for column in ["avg_cost", "duration_hours", "rating"]:
        available[column] = pd.to_numeric(available[column], errors="coerce")
    available = available.dropna(subset=["avg_cost", "duration_hours"])
    available = available.sort_values(
        by=["rating", "avg_cost"], ascending=[False, True]
    ).reset_index(drop=True)

    if budget_per_day is not None:
        budget_per_day = float(budget_per_day)
        if budget_per_day <= 0:
            raise ValueError("Daily budget must be greater than zero.")
        available = available[available["avg_cost"] <= budget_per_day].reset_index(drop=True)

    if available.empty:
        raise ValueError("No activities match this destination and daily activity budget.")

    # Schedule distinct eligible activities once, keeping activity time within 8 hours/day.
    # Activities that cannot fit are left out rather than overloading a day.
    daily_plans = [
        {
            "day": day,
            "activities": [],
            "estimated_activity_cost": 0.0,
            "total_duration_hours": 0.0
        }
        for day in range(1, days + 1)
    ]

    day_index = 0
    for _, activity in available.iterrows():
        duration = float(activity["duration_hours"])
        cost = float(activity["avg_cost"])
        rating = activity["rating"]
        if duration <= 0 or duration > 8:
            continue

        placed = False
        for offset in range(days):
            index = (day_index + offset) % days
            current = daily_plans[index]
            if current["total_duration_hours"] + duration <= 8:
                current["activities"].append({
                    "activity_id": str(activity["activity_id"]),
                    "activity_name": str(activity["activity_name"]),
                    "activity_type": str(activity["activity_type"]),
                    "estimated_activity_cost": cost,
                    "duration_hours": duration,
                    "rating": float(rating) if pd.notna(rating) else None,
                })
                current["estimated_activity_cost"] += cost
                current["total_duration_hours"] += duration
                day_index = (index + 1) % days
                placed = True
                break

        # Do not pile an extra activity onto the least-full day when none can fit.
        if not placed:
            continue

    for current in daily_plans:
        if not current["activities"]:
            current["activities"].append({
                "activity_id": f"FREE-{current['day']:03d}",
                "activity_name": f"Flexible / rest day {current['day']} (no unused activity fits the day plan)",
                "activity_type": "Flexible",
                "estimated_activity_cost": 0.0,
                "duration_hours": 0.0,
                "rating": None,
            })

    maps_summary = enrich_itinerary_with_maps(
        daily_plans,
        destination_name=str(destination_row["name"]),
        travel_date=travel_date,
    )
    for day in daily_plans:
        day["estimated_activity_cost"] = round(day["estimated_activity_cost"], 2)
        day["total_duration_hours"] = round(day["total_duration_hours"], 2)

    hotel_options = []
    if os.path.exists(HOTELS_PATH):
        hotels = pd.read_csv(HOTELS_PATH)
        hotels = hotels[
            hotels["destination_id"].astype(str).str.upper() == destination_id
        ].copy()
        if not hotels.empty:
            hotels["price_per_night"] = pd.to_numeric(hotels["price_per_night"], errors="coerce")
            hotels["rating"] = pd.to_numeric(hotels["rating"], errors="coerce")
            hotels = hotels.sort_values(["rating", "price_per_night"], ascending=[False, True])
            for _, hotel in hotels.head(3).iterrows():
                hotel_options.append({
                    "hotel_name": str(hotel["hotel_name"]),
                    "hotel_type": str(hotel["hotel_type"]),
                    "estimated_price_per_night": float(hotel["price_per_night"]),
                    "rating": float(hotel["rating"]) if pd.notna(hotel["rating"]) else None,
                    "amenities": str(hotel["amenities"]),
                    "distance_from_center_km": float(hotel["distance_from_center_km"]),
                    "note": "Dataset estimate; availability and current price are not verified."
                })

    transport_options = []
    if os.path.exists(TRAVEL_PATH):
        travel = pd.read_csv(TRAVEL_PATH)
        travel = travel[
            travel["destination_id"].astype(str).str.upper() == destination_id
        ].copy()
        if not travel.empty:
            travel["estimated_cost"] = pd.to_numeric(travel["estimated_cost"], errors="coerce")
            travel["estimated_duration_hours"] = pd.to_numeric(
                travel["estimated_duration_hours"], errors="coerce"
            )
            for _, route in travel.sort_values("estimated_cost").head(5).iterrows():
                transport_options.append({
                    "origin_city": str(route["origin_city"]),
                    "transport_mode": str(route["transport_mode"]),
                    "estimated_cost": float(route["estimated_cost"]),
                    "estimated_duration_hours": float(route["estimated_duration_hours"]),
                    "distance_km": float(route["distance_km"]),
                    "note": "Dataset estimate only; not a live schedule, ticket, or availability."
                })

    activity_total = sum(day["estimated_activity_cost"] for day in daily_plans)
    hotel_cost = float(destination_row["avg_hotel_cost"]) * max(days - 1, 0)
    food_cost = float(destination_row["avg_food_cost"]) * days
    local_transport_cost = float(destination_row["avg_local_transport_cost"]) * days

    return {
        "destination_id": destination_id,
        "destination_name": str(destination_row["name"]),
        "days": days,
        "itinerary": daily_plans,
        "estimated_activity_total": round(activity_total, 2),
        "estimated_hotel_cost_for_trip": round(hotel_cost, 2),
        "estimated_food_cost_for_trip": round(food_cost, 2),
        "estimated_local_transport_cost_for_trip": round(local_transport_cost, 2),
        "estimated_trip_total_excluding_intercity_travel": round(
            activity_total + hotel_cost + food_cost + local_transport_cost, 2
        ),
        "hotel_options": hotel_options,
        "intercity_transport_options": transport_options,
        "maps_enrichment": maps_summary,
        "data_notice": (
            "Costs and options are based on the project's sample datasets. "
            "They are estimates, not live prices, bookings, or availability."
        )
    }





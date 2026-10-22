
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.models.destination_recommender import recommend_destinations
from app.services.recommendation_service import get_recommendations as get_personalized_recommendations


router = APIRouter(
    prefix="/recommendations",
    tags=["Destination Recommendations"],
)


class RecommendationRequest(BaseModel):
    category: str | None = None
    max_daily_cost: float | None = Field(default=None, gt=0)
    season: str | None = None
    top_n: int = Field(default=5, ge=1, le=20)


class PersonalizedRecommendationRequest(BaseModel):
    budget: float = Field(gt=0)
    duration: int = Field(gt=0)
    interests: list[str]
    travellers: int = Field(gt=0)


@router.post("/")
def recommend_by_preferences(request: RecommendationRequest):
    """Recommend destinations using category, daily cost, and season filters."""
    try:
        results = recommend_destinations(
            category=request.category,
            max_daily_cost=request.max_daily_cost,
            season=request.season,
            top_n=request.top_n,
        )
        return {
            "count": len(results),
            "recommendations": results,
        }
    except (ValueError, FileNotFoundError) as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/personalized")
def recommend_personalized(request: PersonalizedRecommendationRequest):
    """Recommend destinations based on a traveler's trip preferences."""
    try:
        results = get_personalized_recommendations(
            budget=request.budget,
            interests=request.interests,
            duration=request.duration,
            travellers=request.travellers,
        )
        return {"recommendations": results}
    except (ValueError, FileNotFoundError) as error:
        raise HTTPException(status_code=400, detail=str(error))

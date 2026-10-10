
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.models.destination_recommender import recommend_destinations

router = APIRouter(
    prefix="/recommendations",
    tags=["Destination Recommendations"]
)


class RecommendationRequest(BaseModel):
    category: str | None = None
    max_daily_cost: float | None = Field(default=None, gt=0)
    season: str | None = None
    top_n: int = Field(default=5, ge=1, le=20)


@router.post("/")
def get_recommendations(request: RecommendationRequest):
    try:
        results = recommend_destinations(
            category=request.category,
            max_daily_cost=request.max_daily_cost,
            season=request.season,
            top_n=request.top_n
        )

        return {
            "count": len(results),
            "recommendations": results
        }

    except (ValueError, FileNotFoundError) as error:
        raise HTTPException(status_code=400, detail=str(error))
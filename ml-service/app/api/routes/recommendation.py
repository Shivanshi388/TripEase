from fastapi import APIRouter
from pydantic import BaseModel

from app.services.recommendation_service import get_recommendations


router = APIRouter()


class RecommendationRequest(BaseModel):
    budget: float
    duration: int
    interests: list[str]
    travellers: int


@router.post("/recommendations")
def recommend(request: RecommendationRequest):
    recommendations = get_recommendations(
        budget=request.budget,
        interests=request.interests,
        duration=request.duration,
        travellers=request.travellers
    )

    return {
        "recommendations": recommendations
    }
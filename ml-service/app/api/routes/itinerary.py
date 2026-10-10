
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.models.itinerary_generator import generate_itinerary

router = APIRouter(
    prefix="/itinerary",
    tags=["Itinerary Generation"]
)


class ItineraryRequest(BaseModel):
    destination_id: str
    days: int = Field(gt=0, le=30)
    budget_per_day: float | None = Field(default=None, gt=0)


@router.post("/generate")
def create_itinerary(request: ItineraryRequest):
    try:
        return generate_itinerary(
            destination_id=request.destination_id,
            days=request.days,
            budget_per_day=request.budget_per_day
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    except FileNotFoundError as error:
        raise HTTPException(status_code=500, detail=str(error))
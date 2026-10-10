
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.prediction_service import get_budget_prediction

router = APIRouter(
    prefix="/budget",
    tags=["Budget Prediction"]
)


class BudgetRequest(BaseModel):
    destination_id: str
    days: int = Field(gt=0)
    travelers: int = Field(gt=0)


@router.post("/predict")
def predict_trip_budget(request: BudgetRequest):
    try:
        result = get_budget_prediction(
            destination_id=request.destination_id,
            days=request.days,
            travelers=request.travelers
        )
        return result

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )
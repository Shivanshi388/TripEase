from fastapi import FastAPI
from app.api.routes.budget_prediction import router as budget_router
from app.api.routes.recommendation import router as recommendation_router
from app.api.routes.itinerary import router as itinerary_router
app = FastAPI(
    title="TripEase ML API",
    description="API for TripEase machine learning services",
    version="1.0.0"
)
app.include_router(budget_router)
app.include_router(recommendation_router)
app.include_router(itinerary_router)
@app.get("/")
def home():
    return {
        "message": "Welcome to TripEase ML API!",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
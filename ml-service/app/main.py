from fastapi import FastAPI
from app.api.routes.recommendation import router as recommendation_router

app = FastAPI(title="TripEase Recommendation API")

app.include_router(recommendation_router)


@app.get("/")
def root():
    return {"message": "TripEase Recommendation API is running"}
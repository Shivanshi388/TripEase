from app.models.budget_predictor import predict_budget


def get_budget_prediction(
    destination_id,
    days,
    travelers
):
    """
    Get budget prediction for a trip.
    """

    # Validate input
    if days <= 0:
        raise ValueError("Days must be greater than 0.")

    if travelers <= 0:
        raise ValueError("Travelers must be greater than 0.")

    # Get prediction from ML model
    predicted_budget = predict_budget(
        destination_id=destination_id,
        days=days,
        travelers=travelers
    )

    return {
        "destination_id": destination_id,
        "days": days,
        "travelers": travelers,
        "predicted_budget": predicted_budget
    }
if __name__ == "__main__":

    result = get_budget_prediction(
        destination_id="D001",
        days=3,
        travelers=2
    )

    print(result)
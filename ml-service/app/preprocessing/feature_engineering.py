import pandas as pd


def create_features(df):
    """
    Create useful features for TripEase datasets.
    """

    df = df.copy()

    # Standardize column names
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    return df
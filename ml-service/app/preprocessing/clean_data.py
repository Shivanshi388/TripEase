
from pathlib import Path

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[3]
INPUT_FILE = PROJECT_ROOT / "data" / "raw" / "destinations.csv"
OUTPUT_FILE = PROJECT_ROOT / "data" / "processed" / "cleaned_destinations.csv"


def clean_data(df):
    """
    Clean a dataset by standardizing column names, removing duplicate rows,
    and filling missing numeric and categorical values.
    """
    df = df.copy()

    # Standardize column names
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    # Remove duplicate rows
    df = df.drop_duplicates()

    # Fill missing numeric values with each column's median
    numeric_columns = df.select_dtypes(include="number").columns
    for column in numeric_columns:
        median = df[column].median()
        if pd.notna(median):
            df[column] = df[column].fillna(median)

    # Fill missing categorical values with each column's most common value
    categorical_columns = df.select_dtypes(include="object").columns
    for column in categorical_columns:
        mode = df[column].mode()
        if not mode.empty:
            df[column] = df[column].fillna(mode[0])

    return df


def clean_destinations():
    """Clean the destination dataset and save the processed output."""
    df = pd.read_csv(INPUT_FILE)

    # Keep one row per destination
    df = df.drop_duplicates(subset=["destination_id"])

    required_columns = [
        "destination_id",
        "name",
        "category",
        "best_season",
        "avg_daily_cost",
        "rating",
        "popularity",
        "latitude",
        "longitude",
    ]

    missing_columns = [
        column for column in required_columns if column not in df.columns
    ]
    if missing_columns:
        raise ValueError(f"Destination dataset is missing columns: {missing_columns}")

    df = df[required_columns]
    df = df.dropna()

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_FILE, index=False)

    return df


if __name__ == "__main__":
    clean_destinations()
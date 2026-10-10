import pandas as pd


def clean_data(df):
    """
    Clean a dataset by:
    1. Standardizing column names
    2. Removing duplicate rows
    3. Handling missing values
    """

    # Make a copy
    df = df.copy()

    # 1. Standardize column names
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    # 2. Remove duplicate rows
    df = df.drop_duplicates()

    # 3. Handle missing values

    # Numeric columns → fill missing values with median
    numeric_columns = df.select_dtypes(include="number").columns

    for column in numeric_columns:
        df[column] = df[column].fillna(df[column].median())

    # Categorical columns → fill missing values with mode
    categorical_columns = df.select_dtypes(include="object").columns

    for column in categorical_columns:
        if not df[column].mode().empty:
            df[column] = df[column].fillna(df[column].mode()[0])

    return df
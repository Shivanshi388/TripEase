import pandas as pd


def encode_data(df):
    """
    Convert categorical columns into numerical features.
    """

    df = df.copy()

    categorical_columns = df.select_dtypes(
        include=["object"]
    ).columns

    df = pd.get_dummies(
        df,
        columns=categorical_columns,
        drop_first=True
    )

    return df
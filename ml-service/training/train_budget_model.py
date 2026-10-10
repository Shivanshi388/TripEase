import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# =========================================================
# 1. FIND PROJECT PATHS
# =========================================================

# Current file:
# TripEase/ml-service/training/train_budget_model.py

# Go from training → ml-service
ML_SERVICE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

# Go from ml-service → TripEase
PROJECT_PATH = os.path.abspath(
    os.path.join(ML_SERVICE_PATH, "..")
)


# =========================================================
# 2. LOAD RAW DATA
# =========================================================

DATA_PATH = os.path.join(
    PROJECT_PATH,
    "data",
    "raw",
    "expenses.csv"
)

print("Loading dataset from:")
print(DATA_PATH)

df = pd.read_csv(DATA_PATH)

print("\nOriginal dataset shape:", df.shape)


# =========================================================
# 3. BASIC CLEANING
# =========================================================

# Standardize column names
df.columns = (
    df.columns
    .str.strip()
    .str.lower()
    .str.replace(" ", "_")
)

# Remove duplicate rows
df = df.drop_duplicates()

# Fill missing numerical values
numeric_columns = df.select_dtypes(
    include="number"
).columns

for column in numeric_columns:
    df[column] = df[column].fillna(
        df[column].median()
    )

# Fill missing categorical values
categorical_columns = df.select_dtypes(
    include="object"
).columns

for column in categorical_columns:
    if not df[column].mode().empty:
        df[column] = df[column].fillna(
            df[column].mode()[0]
        )


print("Cleaned dataset shape:", df.shape)


# =========================================================
# 4. DEFINE TARGET
# =========================================================

# We want to predict total trip cost

target = "total_cost"

y = df[target]


# =========================================================
# 5. SELECT INPUT FEATURES
# =========================================================

# We are using:
#
# destination_id
# days
# travelers
#
# We are NOT using:
#
# total_cost → target
# trip_id → just ID
# budget_category → derived from total cost

X = df[
    [
        "destination_id",
        "days",
        "travelers"
    ]
]


# =========================================================
# 6. DEFINE FEATURE TYPES
# =========================================================

categorical_features = [
    "destination_id"
]

numeric_features = [
    "days",
    "travelers"
]


# =========================================================
# 7. PREPROCESSING
# =========================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        ),
        (
            "numeric",
            "passthrough",
            numeric_features
        )
    ]
)


# =========================================================
# 8. CREATE MODEL
# =========================================================

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)


# =========================================================
# 9. CREATE PIPELINE
# =========================================================

pipeline = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor
        ),
        (
            "model",
            model
        )
    ]
)


# =========================================================
# 10. TRAIN / TEST SPLIT
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# =========================================================
# 11. TRAIN MODEL
# =========================================================

pipeline.fit(
    X_train,
    y_train
)

print("\nModel training completed!")


# =========================================================
# 12. PREDICTIONS
# =========================================================

y_pred = pipeline.predict(X_test)


# =========================================================
# 13. EVALUATION
# =========================================================

mae = mean_absolute_error(
    y_test,
    y_pred
)

mse = mean_squared_error(
    y_test,
    y_pred
)

rmse = mse ** 0.5

r2 = r2_score(
    y_test,
    y_pred
)


print("\n===================================")
print("       MODEL PERFORMANCE")
print("===================================")

print("MAE :", round(mae, 2))
print("RMSE:", round(rmse, 2))
print("R2  :", round(r2, 2))


# =========================================================
# 14. SAVE MODEL
# =========================================================

MODEL_DIR = os.path.join(
    ML_SERVICE_PATH,
    "saved_model"
)

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)


MODEL_PATH = os.path.join(
    MODEL_DIR,
    "budget_model.pkl"
)


joblib.dump(
    pipeline,
    MODEL_PATH
)


print("\n===================================")
print("Model saved successfully!")
print("===================================")

print("Model location:")
print(MODEL_PATH)
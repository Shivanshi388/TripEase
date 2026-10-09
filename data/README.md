# TripEase Dataset Documentation

This directory contains raw and processed datasets used by TripEase for
travel destination discovery, cost estimation, and trip planning.

## Directory Structure

- `raw/`: Source CSV datasets.
- `processed/`: Cleaned or transformed datasets prepared for analysis
  and machine learning.

## Raw Datasets

### 1. destinations.csv

Destination information used for browsing and destination recommendations.

Key columns:
- `destination_id`: Unique destination identifier.
- `name`, `country`, `state`, `city`: Destination location.
- `category`: Destination type.
- `best_season`: Recommended travel season.
- `avg_daily_cost`: Estimated average daily travel cost.
- `avg_hotel_cost`, `avg_food_cost`, `avg_local_transport_cost`,
  `avg_activity_cost`: Estimated expense components.
- `latitude`, `longitude`: Geographic coordinates.
- `rating`, `popularity`: Destination rating and popularity indicators.

### 2. expenses.csv

Trip expense records for cost analysis and budget estimation.

Key columns:
- `trip_id`: Unique trip identifier.
- `destination_id`: Associated destination.
- `days`, `travelers`: Trip duration and group size.
- `transport_cost`, `hotel_cost`, `food_cost`, `activity_cost`,
  `local_transport_cost`, `miscellaneous_cost`: Expense components.
- `total_cost`: Total estimated trip cost.
- `budget_category`: Budget classification.

### 3. travel_costs.csv

Illustrative transportation estimates from Delhi to supported destinations.

Columns:
- `origin_city`: Starting city.
- `destination_id`: Destination identifier.
- `transport_mode`: Transportation mode.
- `estimated_cost`: Illustrative estimated cost, in INR.
- `estimated_duration_hours`: Illustrative travel duration, in hours.
- `distance_km`: Approximate distance, in kilometers.

**Important:** These transportation values are sample estimates for
development and testing. They are not live fares, verified schedules,
or guaranteed distances. Replace or validate them with reliable data
before using them for actual travel decisions.

### 4. activities.csv

Activities and experiences associated with destinations.

Columns include activity ID, destination ID, activity name, activity
type, average cost, duration in hours, rating, and suitable audience.

### 5. hotels.csv

Sample accommodation information associated with destinations.

Columns include hotel ID, destination ID, hotel name, hotel type,
price per night, rating, amenities, and distance from the city center.

Hotel prices and ratings should be verified before being presented
as current real-world information.

### 6. destination_features.csv

Destination attributes and category indicators for recommendation
or machine-learning workflows.

Columns include destination ID, category, best season, average daily
cost, rating, popularity, and indicators for beaches, mountains,
heritage, adventure, nature, spirituality, cities, culture, and
backwaters.

## Data Quality and Usage Notes

- CSV files use a header row to identify their columns.
- Destination IDs connect records across related datasets.
- Cost values should be interpreted in Indian rupees (INR) where
  applicable.
- Sample records may be synthetic or illustrative and should not be
  treated as verified ground truth.
- Validate missing values, duplicate identifiers, numeric ranges,
  and relationships between destination IDs before model training.
- Keep raw source data separate from cleaned or transformed data.
- Do not store passwords, API keys, or other secrets in these files.

## Suggested Workflow

1. Validate the raw CSV files.
2. Clean and transform data into `processed/`.
3. Document any transformations and assumptions.
4. Split suitable datasets into training, validation, and test sets
   before evaluating machine-learning models.

## Processed datasets

### budget_prediction.csv
- Location: `data/processed/budget_prediction.csv`
- Source: `data/raw/expenses.csv`
- Purpose: Development dataset for budget-prediction experiments.
- Records: 20 sample trip records.
- Target column: `total_cost`
- Potential features: `destination_id`, `days`, and `travelers`.
- `trip_id` is an identifier and should not be used as a predictive feature.
- Expense components should only be used as predictors if they are known at prediction time; otherwise, they cause target leakage.
- This small dataset is intended for experimentation, not production deployment. Validate its provenance and collect more representative records before drawing conclusions.

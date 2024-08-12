import pandas as pd

def load_and_process_data(mongo):
    # Access the MongoDB collections
    googleplaystore_collection = mongo.db.googleplaystore
    applestore_collection = mongo.db.applestore

    # Load data from MongoDB
    googleplay_data = list(googleplaystore_collection.find())
    applestore_data = list(applestore_collection.find())

    # Convert data to DataFrames
    googleplay_df = pd.DataFrame(googleplay_data)
    applestore_df = pd.DataFrame(applestore_data)

    # Process Google Play Store Data
    if 'Genres' in googleplay_df.columns:
        googleplay_df['Genres'] = googleplay_df['Genres'].str.split(';').str[0]  # Consider only the primary genre
        top_googleplay_genres = googleplay_df['Genres'].value_counts().head(10)
    else:
        top_googleplay_genres = pd.Series([], dtype=int)  # Empty series if 'Genres' is not a column

    # Process Apple App Store Data
    if 'prime_genre' in applestore_df.columns:
        top_applestore_genres = applestore_df['prime_genre'].value_counts().head(10)
    else:
        top_applestore_genres = pd.Series([], dtype=int)  # Empty series if 'prime_genre' is not a column

    # Convert data to JSON-serializable format
    googleplay_data = {
        'labels': top_googleplay_genres.index.tolist(),
        'data': top_googleplay_genres.values.tolist()
    }
    
    applestore_data = {
        'labels': top_applestore_genres.index.tolist(),
        'data': top_applestore_genres.values.tolist()
    }

    return googleplay_data, applestore_data

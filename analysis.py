import pandas as pd

def load_and_process_data():
    # Load datasets
    googleplaystore_data = pd.read_csv('googleplaystore.csv')
    applestore_data = pd.read_csv('AppleStore.csv')

    # Process Google Play Store Data
    googleplaystore_data['Genres'] = googleplaystore_data['Genres'].str.split(';').str[0]  # Consider only the primary genre
    top_googleplay_genres = googleplaystore_data['Genres'].value_counts().head(10)

    # Process Apple App Store Data
    top_applestore_genres = applestore_data['prime_genre'].value_counts().head(10)

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

def get_analysis_data():
    googleplay_data, applestore_data = load_and_process_data()
    return googleplay_data, applestore_data

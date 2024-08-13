def load_and_process_data(mongo):
    db = mongo.db

    # Google Play Store
    playstore_collection = db.googleplaystore

    # Get the top 10 genre counts
    pipeline_playstore_genres = [
        {"$group": {"_id": "$Category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}  # Limit to top 10 genres
    ]
    playstore_genre_counts = list(playstore_collection.aggregate(pipeline_playstore_genres))
    playstore_genre_counts = [{'genre': item['_id'], 'count': item['count']} for item in playstore_genre_counts]

    # Apple App Store
    applestore_collection = db.applestore

    # Get the top 10 genre counts
    pipeline_applestore_genres = [
        {"$group": {"_id": "$prime_genre", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}  # Limit to top 10 genres
    ]
    applestore_genre_counts = list(applestore_collection.aggregate(pipeline_applestore_genres))
    applestore_genre_counts = [{'prime_genre': item['_id'], 'count': item['count']} for item in applestore_genre_counts]

    return {
        'playstore_genre_counts': playstore_genre_counts,
        'applestore_genre_counts': applestore_genre_counts
    }

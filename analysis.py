def load_and_process_data(mongo):
    db = mongo.db

    # Google Play Store
    playstore_collection = db.googleplaystore

    # Get the top 10 genre counts, filtering out documents where 'Category' is None, empty, or missing
    pipeline_playstore_genres = [
        {"$match": {"Category": {"$exists": True, "$ne": None, "$ne": ""}}},  # Ensure 'Category' exists and is not None or empty
        {"$group": {"_id": "$Category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}  # Limit to top 10 genres
    ]
    playstore_genre_counts = list(playstore_collection.aggregate(pipeline_playstore_genres))
    playstore_genre_counts = [{'genre': item['_id'], 'count': min(item['count'], 5000)} for item in playstore_genre_counts]

    # Apple App Store
    applestore_collection = db.applestore

    # Get the top 10 genre counts, filtering out documents where 'prime_genre' is None, empty, or missing
    pipeline_applestore_genres = [
        {"$match": {"prime_genre": {"$exists": True, "$ne": None, "$ne": ""}}},  # Ensure 'prime_genre' exists and is not None or empty
        {"$group": {"_id": "$prime_genre", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}  # Limit to top 10 genres
    ]
    applestore_genre_counts = list(applestore_collection.aggregate(pipeline_applestore_genres))
    applestore_genre_counts = [{'prime_genre': item['_id'], 'count': min(item['count'], 5000)} for item in applestore_genre_counts]

    return {
        'playstore_genre_counts': playstore_genre_counts,
        'applestore_genre_counts': applestore_genre_counts
    }

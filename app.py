from flask import Flask, render_template, request, jsonify
from flask_pymongo import PyMongo
import random
from bson import ObjectId  # Import ObjectId from bson
from sentimental import get_sentiment
from analysis import load_and_process_data

app = Flask(__name__)

# Configure MongoDB connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/Store"  # Database name 'store'
mongo = PyMongo(app)

def load_feedback():
    with open('positive.txt', 'r') as file:
        positive_feedback = [line.strip() for line in file.readlines()]
    with open('negative.txt', 'r') as file:
        negative_feedback = [line.strip() for line in file.readlines()]
    return positive_feedback, negative_feedback

positive_feedback, negative_feedback = load_feedback()

def get_top_playstore_apps():
    db = mongo.db
    playstore_collection = db.googleplaystore  # Collection name 'googleplaystore'

    # Use an aggregation pipeline to get the top 10 unique apps by Reviews
    pipeline = [
        {"$sort": {"Reviews": -1}},  # Sort by Reviews in descending order
        {"$group": {
            "_id": "$App",  # Group by the 'App' field to ensure uniqueness
            "App": {"$first": "$App"},  # Get the first occurrence of the App
            "Reviews": {"$first": "$Reviews"},  # Get the first occurrence of Reviews
            "Category": {"$first": "$Category"},  # Include other fields as needed
            "Rating": {"$first": "$Rating"},
            "Installs": {"$first": "$Installs"},
            # Add more fields as needed
        }},
        {"$sort": {"Reviews": -1}},  # Sort the grouped result again by Reviews
        {"$limit": 10}  # Limit the result to top 10
    ]
    
    top_apps = playstore_collection.aggregate(pipeline)
    return list(top_apps)


def get_top_applestore_apps():
    db = mongo.db
    applestore_collection = db.applestore  # Collection name 'applestore'
    top_apps = applestore_collection.find().sort("rating_count_tot", -1).limit(10)
    return list(top_apps)

def convert_objectid_to_str(data):
    """
    Recursively convert ObjectId fields to strings in a list of dictionaries.
    """
    if isinstance(data, list):
        for item in data:
            convert_objectid_to_str(item)
    elif isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, ObjectId):
                data[key] = str(value)
            elif isinstance(value, dict):
                convert_objectid_to_str(value)
            elif isinstance(value, list):
                convert_objectid_to_str(value)
    return data

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/app', methods=['GET', 'POST'])
def index():
    app_info = None
    playstore_info = None
    applestore_info = None
    comparison = False
    error_message = None
    feedback_playstore = None
    feedback_applestore = None
    feedback_sentiment_playstore = None
    feedback_sentiment_applestore = None
    playstore_comparison = None
    applestore_comparison = None

    if request.method == 'POST':
        app_name = request.form.get('app_name')
        store = request.form.get('store')

        if app_name and store:
            db = mongo.db
            if store == 'playstore':
                filtered_playstore = db.googleplaystore.find_one({"App": {"$regex": app_name, "$options": "i"}})
                if filtered_playstore:
                    playstore_info = filtered_playstore
                    feedback_playstore = random.choice(positive_feedback + negative_feedback)
                    feedback_sentiment_playstore = get_sentiment(feedback_playstore)
                else:
                    error_message = "App not found in Google Play Store."

            elif store == 'applestore':
                filtered_applestore = db.applestore.find_one({"track_name": {"$regex": app_name, "$options": "i"}})
                if filtered_applestore:
                    applestore_info = filtered_applestore
                    feedback_applestore = random.choice(positive_feedback + negative_feedback)
                    feedback_sentiment_applestore = get_sentiment(feedback_applestore)
                else:
                    error_message = "App not found in Apple App Store."

            elif store == 'both':
                filtered_playstore = db.googleplaystore.find_one({"App": {"$regex": app_name, "$options": "i"}})
                filtered_applestore = db.applestore.find_one({"track_name": {"$regex": app_name, "$options": "i"}})
                
                if filtered_playstore and filtered_applestore:
                    playstore_info = filtered_playstore
                    applestore_info = filtered_applestore
                    comparison = True
                    feedback_playstore = random.choice(positive_feedback + negative_feedback)
                    feedback_applestore = random.choice(positive_feedback + negative_feedback)
                    feedback_sentiment_playstore = get_sentiment(feedback_playstore)
                    feedback_sentiment_applestore = get_sentiment(feedback_applestore)
                    playstore_comparison = get_top_playstore_apps()
                    applestore_comparison = get_top_applestore_apps()
                elif not filtered_playstore:
                    error_message = "App not found in Google Play Store."
                elif not filtered_applestore:
                    error_message = "App not found in Apple App Store."
                else:
                    error_message = "App not found in both stores."

    return render_template(
        'app.html',
        playstore_info=playstore_info,
        applestore_info=applestore_info,
        comparison=comparison,
        error_message=error_message,
        feedback_playstore=feedback_playstore,
        feedback_applestore=feedback_applestore,
        feedback_sentiment_playstore=feedback_sentiment_playstore,
        feedback_sentiment_applestore=feedback_sentiment_applestore,
        playstore_comparison=playstore_comparison,
        applestore_comparison=applestore_comparison
    )

@app.route('/about-us')
def about_us():
    return render_template('about_us.html')

@app.route('/analysis')
def analysis():
    googleplay_data, applestore_data = load_and_process_data(mongo)
    return render_template(
        'analysis.html',
        googleplay_data=googleplay_data,
        applestore_data=applestore_data
    )

@app.route('/api/playstore_comparison')
def api_playstore_comparison():
    try:
        playstore_data = get_top_playstore_apps()
        playstore_data = convert_objectid_to_str(playstore_data)
        return jsonify(playstore_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/applestore_comparison')
def api_applestore_comparison():
    try:
        applestore_data = get_top_applestore_apps()
        applestore_data = convert_objectid_to_str(applestore_data)
        return jsonify(applestore_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

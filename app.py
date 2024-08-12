from flask import Flask, render_template, request, jsonify
import pandas as pd
import random
from sentimental import get_sentiment
from analysis import get_analysis_data

app = Flask(__name__)


# Load datasets
playstore_data = pd.read_csv('googleplaystore.csv')
applestore_data = pd.read_csv('Applestore.csv')

# Load feedback from text files
def load_feedback():
    with open('positive.txt', 'r') as file:
        positive_feedback = [line.strip() for line in file.readlines()]
    with open('negative.txt', 'r') as file:
        negative_feedback = [line.strip() for line in file.readlines()]
    return positive_feedback, negative_feedback

positive_feedback, negative_feedback = load_feedback()

def get_top_playstore_apps():
    top_apps = playstore_data[['App', 'Reviews']].copy()
    top_apps['Reviews'] = top_apps['Reviews'].astype(str)  # Convert to string
    top_apps['Reviews'] = top_apps['Reviews'].str.replace(',', '').str.replace('+', '')
    top_apps['Reviews'] = pd.to_numeric(top_apps['Reviews'], errors='coerce')
    top_apps = top_apps.dropna(subset=['Reviews'])
    top_apps = top_apps.drop_duplicates(subset=['App'])  # Remove duplicate apps
    top_apps = top_apps.sort_values(by='Reviews', ascending=False).head(10)
    return top_apps.to_dict(orient='records')

def get_top_applestore_apps():
    top_apps = applestore_data[['track_name', 'rating_count_tot']].copy()
    top_apps['rating_count_tot'] = pd.to_numeric(top_apps['rating_count_tot'], errors='coerce')
    top_apps = top_apps.dropna(subset=['rating_count_tot'])
    top_apps = top_apps.sort_values(by='rating_count_tot', ascending=False).head(10)
    return top_apps.to_dict(orient='records')

# Home route
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
            if store == 'playstore':
                filtered_playstore = playstore_data[playstore_data['App'].str.contains(app_name, case=False, na=False)]
                if not filtered_playstore.empty:
                    playstore_info = filtered_playstore.iloc[0].to_dict()
                    feedback_playstore = random.choice(positive_feedback + negative_feedback)
                    feedback_sentiment_playstore = get_sentiment(feedback_playstore)
                else:
                    error_message = "App not found in Google Play Store."

            elif store == 'applestore':
                filtered_applestore = applestore_data[applestore_data['track_name'].str.contains(app_name, case=False, na=False)]
                if not filtered_applestore.empty:
                    applestore_info = filtered_applestore.iloc[0].to_dict()
                    feedback_applestore = random.choice(positive_feedback + negative_feedback)
                    feedback_sentiment_applestore = get_sentiment(feedback_applestore)
                else:
                    error_message = "App not found in Apple App Store."

            elif store == 'both':
                filtered_playstore = playstore_data[playstore_data['App'].str.contains(app_name, case=False, na=False)]
                filtered_applestore = applestore_data[applestore_data['track_name'].str.contains(app_name, case=False, na=False)]
                
                if not filtered_playstore.empty and not filtered_applestore.empty:
                    playstore_info = filtered_playstore.iloc[0].to_dict()
                    applestore_info = filtered_applestore.iloc[0].to_dict()
                    comparison = True
                    feedback_playstore = random.choice(positive_feedback + negative_feedback)
                    feedback_applestore = random.choice(positive_feedback + negative_feedback)
                    feedback_sentiment_playstore = get_sentiment(feedback_playstore)
                    feedback_sentiment_applestore = get_sentiment(feedback_applestore)
                    playstore_comparison = get_top_playstore_apps()
                    applestore_comparison = get_top_applestore_apps()
                elif filtered_playstore.empty:
                    error_message = "App not found in Google Play Store."
                elif filtered_applestore.empty:
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
    googleplay_data, applestore_data = get_analysis_data()
    return render_template(
        'analysis.html',
        googleplay_data=googleplay_data,
        applestore_data=applestore_data
    )

@app.route('/api/playstore_comparison')
def api_playstore_comparison():
    top_apps = get_top_playstore_apps()
    return jsonify(top_apps)

@app.route('/api/applestore_comparison')
def api_applestore_comparison():
    top_apps = get_top_applestore_apps()
    return jsonify(top_apps)

if __name__ == '__main__':
    app.run(debug=True)

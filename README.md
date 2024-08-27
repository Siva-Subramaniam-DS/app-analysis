# App Search Code Structure.
## `App.py`

# 1. Configuration and Setup
**Flask App Initialization:**  
The Flask app is initialized with `app = Flask(__name__)`.  
MongoDB is configured with `app.config["MONGO_URI"] = "mongodb://localhost:27017/Store"`, and PyMongo is used to connect to the MongoDB instance.

**Load Feedback Data:**  
`load_feedback()` function reads positive and negative feedback from text files (`positive.txt` and `negative.txt`).  
This feedback is used later for sentiment analysis.

# 2. Routes and Functionality
## Home Route (/)
**@app.route('/')**: This route serves the homepage, rendering the `home.html` template.

## App Search and Comparison (/AppSearch)
**@app.route('/AppSearch', methods=['GET', 'POST'])**:  
Handles form submissions to search for an app in either the Google Play Store, Apple App Store, or both.  
Based on the search, it queries the corresponding MongoDB collections (`googleplaystore` and `applestore`) using a case-insensitive regex.  
If the app is found, random feedback is selected from the loaded feedback data, and sentiment analysis is performed using the `get_sentiment()` function.  
The results are rendered on the `app.html` page.

## HeloAI Chatbot (/heloai)
**@app.route("/heloai", methods=["POST"])**:  
This route accepts POST requests with user input (question), invokes the HeloAI chatbot using the `chain.invoke()` method, and returns the chatbot's response as a JSON object.

## Analysis Page (/analysis)
**@app.route('/analysis')**:  
Loads and processes data using the `load_and_process_data()` function from the analysis module.  
Renders the `analysis.html` template with processed data such as genre counts for both stores.

## About Us Page (/about-us)
**@app.route('/about-us')**:  
Renders the `about_us.html` template.

## Exploratory Data Analysis (EDA) Page (/eda)
**@app.route('/eda')**:  
Performs EDA using the `perform_eda()` function from the Eda module, which analyzes the data in MongoDB.  
Renders the results in the `eda.html` template, displaying accuracy and classification reports for both stores.

## HeloAI Web Interface (/helobot)
**@app.route("/helobot")**:  
Renders the web interface for HeloAI by serving the `helobot.html` template.

# 3. API Routes
## API for Play Store Top Apps (/api/playstore_top_apps)
**@app.route('/api/playstore_top_apps', methods=['GET'])**:  
Returns a JSON response with the top apps in the Google Play Store.

## API for App Store Top Apps (/api/applestore_top_apps)
**@app.route('/api/applestore_top_apps', methods=['GET'])**:  
Returns a JSON response with the top apps in the Apple App Store.

## API for Play Store Genre Counts (/api/playstore_genre_counts)
**@app.route('/api/playstore_genre_counts', methods=['GET'])**:  
Returns a JSON response with genre counts for the Google Play Store.

## API for App Store Genre Counts (/api/applestore_genre_counts)
**@app.route('/api/applestore_genre_counts', methods=['GET'])**:  
Returns a JSON response with genre counts for the Apple App Store.

# 4. Helper Functions
**Convert ObjectId to String:**  
`convert_objectid_to_str(data)` converts MongoDB ObjectId fields to strings for JSON serialization.

# 5. Running the App
**if __name__ == '__main__':**  
The app runs in debug mode when executed directly.

# Summary
This Flask application allows users to search and compare apps between the Google Play Store and Apple App Store, analyze sentiment based on feedback, perform EDA, and interact with the HeloAI chatbot. It integrates MongoDB for data storage and retrieval, and it supports both HTML rendering and JSON-based API responses.

___
## `App.HTML`

# 1. HTML Structure
## Doctype and Meta Tags
- The `<!DOCTYPE html>` declaration specifies the document type as HTML5.
- The `<meta charset="UTF-8">` tag sets the character encoding for the document to UTF-8.
- The `<meta name="viewport" content="width=device-width, initial-scale=1.0">` ensures the page is responsive and scales properly on all devices.
- The `<meta name="description" content="...">` provides a brief description of the web page's purpose.

### Title
- The `<title>App Comparison</title>` sets the title of the page, which appears in the browser tab.
## CSS Link
- `<link rel="stylesheet" href="static/app.css">` links an external CSS file for styling the page. This file is located in the `static` directory.

# 2. Header
- The `<header>` element contains the title of the page and the current date and time, which are populated by JavaScript.
- The `header` and `header-title` classes are applied for styling, as defined in the external CSS file.

# 3. Navigation Bar
- The `<nav>` element contains a list of navigation links wrapped in `<a>` (anchor) tags.
- Each link (`<a>`) within the list directs the user to different routes in the application, such as Home, App Search, Analysis, EDA Process, Helo AI, and About Us.
- The `navbar-link` class is used for styling, and the `active` class indicates the currently active page.

# 4. Main Content
- The `<main>` element wraps the main content of the page.
- The `<form>` is used to search for an app in the Google Play Store or Apple App Store. The form data is sent via POST to the `/AppSearch` route.

## Form Fields
- **app_name:** A text input field for entering the app name.
- **store:** Radio buttons allowing the user to choose between Google Play Store, Apple App Store, or both.
- The `form-button` class is used to style the submit button.

## Results Section
- The block-level container with `id="result"` displays search results, including app information and sentiment analysis.
- If an error occurs during the search (e.g., the app is not found), an error message is displayed.
- For each store (Google Play or Apple App Store), relevant information such as app name, rating, size, price, version, feedback, and sentiment analysis is displayed.

# 5. Footer
- The `<footer>` contains a copyright notice and is styled using the `footer` class.
- The footer is positioned at the bottom of the page, ensuring a consistent layout regardless of the amount of content.

# 6. JavaScript
- `<script src="static/app.js"></script>` links to an external JavaScript file located in the `static` directory, which likely contains scripts for handling the date and time display and other interactive features on the page.

# 7. Templating and Dynamic Content
- The page uses Jinja2 templating (e.g., `{{ playstore_info['App'] }}`) to inject dynamic content from the Flask backend into the HTML. This allows for server-side rendering of app data, sentiment results, and error messages based on the user's input.

# 8. Conditional Rendering
- The use of `{% if %}` and `{% endif %}` allows for conditional rendering of content, such as displaying the comparison view only when apps from both stores are found.

___
## `App.JS`
# JavaScript Code Explanation
This JavaScript code is designed to perform two main tasks on your web page:

## Display the Current Date and Time
- **`updateDateTime` Function:**
  - The `updateDateTime` function gets the current date and time, formats it, and then updates the corresponding HTML elements (`#date` and `#time`) every second.
  - This function is initially called when the DOM is fully loaded, and then continuously updates the date and time using `setInterval`.

## Fetch and Render Charts for App Store Data
- **`fetchDataAndRenderCharts` Function:**
  - This function fetches data from API endpoints for both the Google Play Store and Apple App Store and then renders bar charts using Chart.js.

### Google Play Store Chart:
- The data is fetched from the `/api/playstore_top_apps` endpoint.
- A bar chart is rendered showing the number of reviews for the top apps.

### Apple App Store Chart:
- The data is fetched from the `/api/applestore_top_apps` endpoint.
- A bar chart is rendered showing the total rating count for the top apps.

## Key Components of the Code:

### `DOMContentLoaded` Event:
- `document.addEventListener('DOMContentLoaded', function () { ... });` ensures that the functions `updateDateTime` and `fetchDataAndRenderCharts` are executed only after the entire DOM has been loaded.

### `updateDateTime` Function:
- The `now` object represents the current date and time.
- The `toLocaleDateString` and `toLocaleTimeString` methods are used to format the date and time based on the user's locale.
- The formatted date and time are then inserted into the respective HTML elements (`#date` and `#time`).

### Chart Rendering:
- The `fetchDataAndRenderCharts` function checks if the HTML elements for the charts (`#playstoreChart` and `#applestoreChart`) are present on the page.
- If the element exists, it fetches data from the relevant API endpoint, processes the data, and uses Chart.js to create a bar chart.
- The charts' appearance (colors, labels, borders) and options (e.g., starting Y-axis at zero) are configured in the Chart object.

### Error Handling:
- The `.catch(error => console.error('Error fetching ...'))` segments log any errors that occur during the data fetching process.

### Integration Considerations:
- Ensure that the HTML elements with IDs `#date`, `#time`, `#playstoreChart`, and `#applestoreChart` exist in the HTML file where this JavaScript is being used.
- The Chart.js library should be included in the HTML file before this script is loaded.
- The APIs `/api/playstore_top_apps` and `/api/applestore_top_apps` should return data in a format that matches the expected structure in the script.


This HTML template is well-organized and integrates with the Flask backend to provide a seamless experience for users searching for app information and sentiment analysis. The external CSS and JavaScript files help maintain a clean separation of concerns for styling and interactivity.

___
# Analysis Code Structure. 
## `Analysis.py`

## `load_and_process_data` Function

### Purpose
The `load_and_process_data` function extracts and processes data from MongoDB collections for both the Google Play Store and Apple App Store. It provides insights into app reviews, genre distribution, and top-performing apps.

### Google Play Store Processing
- **Genre Counts**: Aggregates the top 10 genres based on the number of apps. Filters out invalid or missing genres and limits the count to a maximum of 5000.
- **Top Apps by Reviews**: Retrieves the top 10 apps with the highest number of reviews, sorting by review count and grouping by app attributes.

### Apple App Store Processing
- **Genre Counts**: Aggregates the top 10 genres based on the number of apps, similar to Google Play Store processing. Limits the count to a maximum of 5000.
- **Top Apps by Rating Count**: Retrieves the top 10 apps with the highest rating counts.

### Return Value
The function returns a dictionary with the following keys:
- **`playstore_top_apps`**: List of top 10 apps in the Google Play Store.
- **`applestore_top_apps`**: List of top 10 apps in the Apple App Store.
- **`playstore_genre_counts`**: List of top 10 genres in the Google Play Store.
- **`applestore_genre_counts`**: List of top 10 genres in the Apple App Store.

### Inference
- **Data Insights**: Provides a view of app performance and genre distribution, useful for understanding trends and comparing store offerings.
- **Limitations**: Genre counts are capped at 5000. Only the top 10 genres and apps are returned, which might overlook other significant data.
- **Usage**: Useful for generating reports, visualizations, and further analysis in a web application to help users make informed decisions.

___
## `Analysis.html` 

## Overview
This HTML template is designed for the "Genre and App Analysis" page of a web application. It provides an overview of the top 10 genres and top 10 apps in both the Google Play Store and Apple App Store using Chart.js for visualizations.

## Structure

### 1. **DOCTYPE and Meta Tags**
- `<!DOCTYPE html>`: Specifies the document type as HTML5.
- `<meta charset="UTF-8">`: Sets the character encoding to UTF-8.
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`: Ensures the page is responsive and scales properly on all devices.

### 2. **Title and CSS/JavaScript Links**
- `<title>Genre and App Analysis</title>`: Sets the title of the page.
- `<link rel="stylesheet" href="{{ url_for('static', filename='analysis.css') }}">`: Links to an external CSS file for styling.
- `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>`: Includes the Chart.js library for rendering charts.

### 3. **Header**
- Contains the main title of the page and a section for displaying the current date and time.
- `<header>`:
  - `<h1>Sentiment App Analysis Website</h1>`
  - `<p id="datetime">` with `<span id="date"></span>` and `<span id="time"></span>` for dynamic date and time display.

### 4. **Navigation Bar**
- Provides links to various sections of the application.
- `<nav>`:
  - `<ul>` with `<li>` elements for each navigation link: Home, App Search, Analysis, EDA Process, Helo AI, and About Us.

### 5. **Main Content**
- Displays charts and analysis results.
- `<main>`:
  - **Genres Analysis**:
    - `<h1>Top 10 Genres in Google Play Store and Apple App Store</h1>`
    - `<div id="charts">` containing two `<canvas>` elements for rendering genre charts.
  - **Top Apps Analysis**:
    - `<h1>Top 10 Apps</h1>`
    - `<div id="charts">` containing two `<canvas>` elements for rendering top app charts.

### 6. **Footer**
- Contains a copyright notice.
- `<footer>`:
  - `<p>&copy; 2024 Data Scientists</p>`

### 7. **JavaScript**
- Links to an external JavaScript file for handling chart rendering and dynamic content.
- `<script src="{{ url_for('static', filename='analysis.js') }}"></script>`

## Notes
- Ensure that the `analysis.css` and `analysis.js` files are correctly placed in the `static` directory and that the Chart.js library is included.
- The `{{ url_for('static', filename='...') }}` syntax is used for generating the correct URL for static files in Flask applications.

___
## `Analysis.JS`
# Purpose

- **Update Date and Time**: The code updates the date and time displayed on the webpage.
- **Render Charts**: It fetches data from various API endpoints and renders charts for Google Play Store and Apple App Store genres and top apps.

# Key Components

- **DOM Content Loaded**: Ensures functions for updating the date/time and fetching data are executed after the page has fully loaded.
- **Update Date and Time**: Uses the current date and time to populate specific HTML elements.
- **Fetch Data and Render Charts**:
  - Retrieves genre and top app data from APIs.
  - Uses Chart.js to display data as charts on the page.

# Chart Details

- **Google Play Store**: Shows genre distribution and top apps by reviews.
- **Apple App Store**: Displays genre distribution and top apps by rating count.

# Error Handling

- Logs errors to the console if data fetching fails.

____
# EDA Process Sturcture.
## `EDA.py`
# Purpose

- **Perform EDA and Model Training**: This script connects to a MongoDB database, fetches data from Google Play Store and Apple App Store collections, performs data cleaning, and trains RandomForest models to predict app categories or genres.

# Key Components

- **MongoDB Connection**: Connects to MongoDB to retrieve data from `googleplaystore` and `applestore` collections.
- **Data Cleaning and Conversion**:
  - **Google Play Store**: Cleans and converts size, installs, and rating columns; removes duplicates.
  - **Apple App Store**: Cleans and converts user rating and price; removes duplicates.
- **Data Preparation**:
  - **Google Play Store**: Prepares data for model training by selecting top apps and encoding categorical variables.
  - **Apple App Store**: Prepares data similarly and selects top apps based on rating count.
- **Model Training**:
  - **Google Play Store**: Trains a RandomForestClassifier to predict app categories.
  - **Apple App Store**: Trains a RandomForestClassifier to predict app genres.
- **Accuracy and Results**:
  - Computes and returns model accuracy for both datasets.
  - Generates HTML reports of the top apps for both Google Play Store and Apple App Store.

# Data Cleaning Functions

- **convert_size**: Converts size strings to bytes.
- **convert_installs**: Converts install counts to integers.
- **convert_rating**: Converts rating strings to floats.
- **convert_apple_rating**: Converts Apple Store ratings to floats.
- **convert_apple_price**: Converts Apple Store prices to floats.

# Error Handling

- **Empty DataFrames**: Raises errors if data fetching results in empty DataFrames after cleaning.
- **Insufficient Samples**: Raises errors if there are not enough samples to perform train-test split.

# Example Usage

- **MongoDB Client Creation**: Creates a MongoDB client and performs EDA, printing the results.

___
## `EDA.HTML`
# Purpose

- **Display EDA Results**: This HTML file is designed to show the results of Exploratory Data Analysis (EDA) for Google Play Store and Apple App Store, including model accuracy and top apps.

# Key Components

- **Meta Information**:
  - **Charset and Viewport**: Sets character encoding to UTF-8 and viewport for responsive design.
  - **Description**: Provides a brief description of the page's content.

- **Header**:
  - **Title**: Displays the main heading for the website.
  - **Date and Time**: Shows current date and time dynamically.

- **Navigation Bar**:
  - **Links**: Provides navigation links to other sections of the website.

- **Main Content**:
  - **Results Section**: Displays EDA results, including model accuracy and top 10 apps for both Google Play Store and Apple App Store.
    - **Google Play Store**: Shows accuracy and a table of top apps if data is available.
    - **Apple App Store**: Shows accuracy and a table of top apps if data is available.

- **Footer**:
  - **Copyright Information**: Provides copyright notice.

- **Scripts**:
  - **Chart.js**: Includes Chart.js library for potential chart rendering.
  - **Custom JS**: Includes a custom JavaScript file for additional functionality.

# Template Rendering

- **Dynamic Content**: Uses Jinja2 templating to insert dynamic content (`playstore_accuracy`, `playstore_report`, `applestore_accuracy`, `applestore_report`) into the HTML.

___
## `EDA.JS`
# Purpose

- **Update Date and Time**: This script updates and displays the current date and time on the webpage. The time is updated every second to keep the display current.

# Key Components

- **DOMContentLoaded Event**: Ensures the JavaScript code runs only after the HTML document has been completely loaded and parsed.

- **`updateDateTime` Function**:
  - **Fetches Current Date and Time**: Uses the `Date` object to get the current date and time.
  - **Formats Date and Time**:
    - **Date**: Formats to "year month day" (e.g., "August 27, 2024").
    - **Time**: Formats to "hour:minute:second" (e.g., "15:45:12").
  - **Updates HTML Elements**:
    - **Date Element**: Sets the text content of the element with id `date`.
    - **Time Element**: Sets the text content of the element with id `time`.

- **`setInterval` Function**:
  - **Interval of 1000 milliseconds** (1 second): Calls `updateDateTime` every second to refresh the displayed time.

___

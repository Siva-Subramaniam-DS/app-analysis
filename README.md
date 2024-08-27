# App Search Structure.

``` 1. Configuration and Setup ```
``` Flask App Initialization: ```
The Flask app is initialized with app = Flask(__name__).
MongoDB is configured with app.config["MONGO_URI"] = "mongodb://localhost:27017/Store", and PyMongo is used to connect to the MongoDB instance. ```

``` Load Feedback Data: ```
load_feedback() function reads positive and negative feedback from text files (positive.txt and negative.txt).
This feedback is used later for sentiment analysis.

``` 2. Routes and Functionality ```
Home Route (/)
``` @app.route('/'): ``` This route serves the homepage, rendering the home.html template.
App Search and Comparison (/AppSearch)

``` @app.route('/AppSearch', methods=['GET', 'POST']): ```
Handles form submissions to search for an app in either the Google Play Store, Apple App Store, or both.
Based on the search, it queries the corresponding MongoDB collections (googleplaystore and applestore) using a case-insensitive regex.
If the app is found, random feedback is selected from the loaded feedback data, and sentiment analysis is performed using the get_sentiment() function.
The results are rendered on the app.html page.

``` HeloAI Chatbot (/heloai) ```
@app.route("/heloai", methods=["POST"]):
This route accepts POST requests with user input (question), invokes the HeloAI chatbot using the chain.invoke() method, and returns the chatbot's response as a JSON object.
Analysis Page (/analysis)

``` @app.route('/analysis'): ```
Loads and processes data using the load_and_process_data() function from the analysis module.
Renders the analysis.html template with processed data such as genre counts for both stores.

``` About Us Page (/about-us) ```
@app.route('/about-us'):
Renders the about_us.html template.
Exploratory Data Analysis (EDA) Page (/eda)

``` @app.route('/eda'): ```
Performs EDA using the perform_eda() function from the Eda module, which analyzes the data in MongoDB.
Renders the results in the eda.html template, displaying accuracy and classification reports for both stores.

``` HeloAI Web Interface (/helobot) ```
@app.route("/helobot"):
Renders the web interface for HeloAI by serving the helobot.html template.

``` 3. API Routes ``` 
API for Play Store Top Apps (/api/playstore_top_apps)
``` @app.route('/api/playstore_top_apps', methods=['GET']): ```
Returns a JSON response with the top apps in the Google Play Store.
API for App Store Top Apps (/api/applestore_top_apps)

``` @app.route('/api/applestore_top_apps', methods=['GET']): ```
Returns a JSON response with the top apps in the Apple App Store.
API for Play Store Genre Counts (/api/playstore_genre_counts)

``` @app.route('/api/playstore_genre_counts', methods=['GET']): ```
Returns a JSON response with genre counts for the Google Play Store.
API for App Store Genre Counts (/api/applestore_genre_counts)

``` @app.route('/api/applestore_genre_counts', methods=['GET']): ```
Returns a JSON response with genre counts for the Apple App Store.

``` 4. Helper Functions ```
Convert ObjectId to String:
convert_objectid_to_str(data) converts MongoDB ObjectId fields to strings for JSON serialization.

``` 5. Running the App ```
if __name__ == '__main__':
The app runs in debug mode when executed directly.


``` Summary: ```
This Flask application allows users to search and compare apps between the Google Play Store and Apple App Store, analyse sentiment based on feedback, perform EDA, and interact with the HeloAI chatbot. It integrates MongoDB for data storage and retrieval, and it supports both HTML rendering and JSON-based API responses.```




``` 1. HTML Structure: ``` 
``` Doctype and Meta Tags: ```

The <!DOCTYPE html> declaration specifies the document type as HTML5.
The <meta charset="UTF-8"> tag sets the character encoding for the document to UTF-8.
The <meta name="viewport" content="width=device-width, initial-scale=1.0"> ensures the page is responsive and scales properly on all devices.
The <meta name="description" content="..."> provides a brief description of the web page's purpose.
Title:

The <title>App Comparison</title> sets the title of the page, which appears in the browser tab.
``` CSS Link: ```
<link rel="stylesheet" href="static/app.css"> links an external CSS file for styling the page. This file is located in the static directory.

``` 2. Header: ```
The <header> element contains the title of the page and the current date and time, which are populated by JavaScript.
The class header and header-title are applied for styling, as defined in the external CSS file.

``` 3. Navigation Bar: ``` 
The Navigation tag element contains a list of navigation links wrapped in UnderLine tag and Line tag.
Each link tag within the list directs the user to different routes in the application, such as Home, App Search, Analysis, EDA Process, Helo AI, and About Us.
The navbar-link class is used for styling, and the active class indicates the currently active page.

``` 4. Main Content: ```
The <main> element wraps the main content of the page.
The <form> is used to search for an app in the Google Play Store or Apple App Store. The form data is sent via POST to the /AppSearch route.

``` Form Fields: ```
app_name: A text input field for entering the app name.
store: Radio buttons allowing the user to choose between Google Play Store, Apple App Store, or both.
The form-button class is used to style the submit button.

``` Results Section: ```

The  block-level container ID = "result" displays search results, including app information and sentiment analysis.
If an error occurs during the search (e.g., the app is not found), an error message is displayed.
For each store (Google Play or Apple App Store), relevant information such as app name, rating, size, price, version, feedback, and sentiment analysis is displayed.

``` 5. Footer: ```
The <footer> contains a copyright notice and is styled using the footer class.
The footer is positioned at the bottom of the page, ensuring consistent layout regardless of the amount of content.

``` 6. JavaScript: ```
<script src="static/app.js"></script> links to an external JavaScript file located in the static directory, which likely contains scripts for handling the date and time display and other interactive features on the page.

``` 7. Templating and Dynamic Content: ```
The page uses Jinja2 templating (e.g., {{ playstore_info['App'] }}) to inject dynamic content from the Flask backend into the HTML. This allows for server-side rendering of app data, sentiment results, and error messages based on the user's input.

``` 8. Conditional Rendering: ```
The use of {% if %} and {% endif %} allows for conditional rendering of content, such as displaying the comparison view only when apps from both stores are found.
This HTML template is well-organized and integrates with the Flask backend to provide a seamless experience for users searching for app information and sentiment analysis. The external CSS and JavaScript files help maintain a clean separation of concerns for styling and interactivity.


This JavaScript code is designed to perform two main tasks on your web page:
``` Display the Current Date and Time: ```

The updateDateTime function gets the current date and time, formats it, and then updates the corresponding HTML elements (#date and #time) every second.
The updateDateTime function is initially called when the DOM is fully loaded, and then continuously updates the date and time using setInterval.

Fetch and Render Charts for App Store Data:
The fetchDataAndRenderCharts function is used to fetch data from API endpoints for both Google Play Store and Apple App Store, and then render bar charts using Chart.js.

``` Google Play Store Chart:```

The data is fetched from the /api/playstore_top_apps endpoint.
A bar chart is rendered showing the number of reviews for the top apps.

``` Apple App Store Chart: ```
The data is fetched from the /api/applestore_top_apps endpoint.
A bar chart is rendered showing the total rating count for the top apps.

### Key Components of the Code:

``` DOMContentLoaded Event: ```
document.addEventListener('DOMContentLoaded', function () { ... }); ensures that the functions updateDateTime and fetchDataAndRenderCharts are executed only after the entire DOM has been loaded.

``` updateDateTime Function: ```
The now object represents the current date and time.
The toLocaleDateString and toLocaleTimeString methods are used to format the date and time based on the user's locale.
The formatted date and time are then inserted into the respective HTML elements (#date and #time).

```Chart Rendering: ```
The fetchDataAndRenderCharts function checks if the HTML elements for the charts (#playstoreChart and #applestoreChart) are present on the page.
If the element exists, it fetches data from the relevant API endpoint, processes the data, and uses Chart.js to create a bar chart.
The charts' appearance (colors, labels, borders) and options (e.g., starting Y-axis at zero) are configured in the Chart object.

``` Error Handling: ```
The .catch(error => console.error('Error fetching ...')) segments log any errors that occur during the data fetching process.

``` Integration Considerations: ```
Ensure that the HTML elements with IDs #date, #time, #playstoreChart, and #applestoreChart exist in the HTML file where this JavaScript is being used.
The Chart.js library should be included in the HTML file before this script is loaded.
The APIs /api/playstore_top_apps and /api/applestore_top_apps should return data in a format that matches the expected structure in the script.


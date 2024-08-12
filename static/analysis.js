document.addEventListener('DOMContentLoaded', function () {
    // Set the current date and time
    function updateDateTime() {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();

        document.getElementById('date').textContent = date;
        document.getElementById('time').textContent = time;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000); // Update every second

    // Function to render Google Play Store chart
    function renderGooglePlayChart(data) {
        const ctxGoogleplay = document.getElementById('googleplayChart').getContext('2d');
        new Chart(ctxGoogleplay, {
            type: 'bar',
            data: {
                labels: data.map(app => app.App), // Assuming 'App' is the key for app names
                datasets: [{
                    label: 'Number of Reviews',
                    data: data.map(app => app.Reviews), // Assuming 'Reviews' is the key for review counts
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Function to render Apple App Store chart
    function renderAppleAppStoreChart(data) {
        const ctxApplestore = document.getElementById('applestoreChart').getContext('2d');
        new Chart(ctxApplestore, {
            type: 'bar',
            data: {
                labels: data.map(app => app.track_name), // Assuming 'track_name' is the key for app names
                datasets: [{
                    label: 'Number of Ratings',
                    data: data.map(app => app.rating_count_tot), // Assuming 'rating_count_tot' is the key for rating counts
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Fetch data from the backend and render charts
    async function fetchDataAndRenderCharts() {
        try {
            // Fetch data for Google Play Store
            const responsePlayStore = await fetch('/api/playstore_comparison');
            const dataPlayStore = await responsePlayStore.json();
            renderGooglePlayChart(dataPlayStore);

            // Fetch data for Apple App Store
            const responseAppStore = await fetch('/api/applestore_comparison');
            const dataAppStore = await responseAppStore.json();
            renderAppleAppStoreChart(dataAppStore);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    fetchDataAndRenderCharts(); // Call the function to fetch data and render charts
});

document.addEventListener('DOMContentLoaded', function () {
    updateDateTime();
    fetchDataAndRenderCharts();
});

function updateDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    document.getElementById('date').textContent = date;
    document.getElementById('time').textContent = time;
}

function fetchDataAndRenderCharts() {
    const playstoreChartElement = document.getElementById('playstoreChart');
    const applestoreChartElement = document.getElementById('applestoreChart');

    if (playstoreChartElement) {
        fetch('/api/playstore_comparison')
            .then(response => response.json())
            .then(data => {
                const labels = data.map(app => app.App);
                const reviews = data.map(app => app.Reviews);

                new Chart(playstoreChartElement, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Reviews',
                            data: reviews,
                            backgroundColor: 'rgba(54, 162, 235, 0.7)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error fetching playstore comparison data:', error));
    }

    if (applestoreChartElement) {
        fetch('/api/applestore_comparison')
            .then(response => response.json())
            .then(data => {
                const labels = data.map(app => app.track_name);
                const ratingCounts = data.map(app => app.rating_count_tot);

                new Chart(applestoreChartElement, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Rating Count',
                            data: ratingCounts,
                            backgroundColor: 'rgba(255, 159, 64, 0.7)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error fetching applestore comparison data:', error));
    }
}

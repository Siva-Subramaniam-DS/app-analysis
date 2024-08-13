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

updateDateTime();
setInterval(updateDateTime, 1000);

function fetchDataAndRenderCharts() {
    const playstoreChartElement = document.getElementById('playstoreChart');
    const applestoreChartElement = document.getElementById('applestoreChart');

    if (playstoreChartElement) {
        fetch('/api/playstore_top_apps')
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
                            backgroundColor: [
                                'rgba(153, 102, 255, 0.7)',
                                'rgba(238, 130, 238, 0.7)',
                                'rgba(255, 159, 64, 0.7)',
                                'rgba(54, 162, 235, 0.7)',
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(255, 99, 71, 0.7)',
                                'rgba(255, 159, 64, 0.7)',
                                'rgba(54, 162, 235, 0.7)'
                            ],
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
        fetch('/api/applestore_top_apps')
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
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(54, 162, 235, 0.7)',
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(153, 102, 255, 0.7)',
                                'rgba(255, 159, 64, 0.7)',
                                'rgba(201, 203, 207, 0.7)',
                                'rgba(255, 99, 71, 0.7)',
                                'rgba(144, 238, 144, 0.7)',
                                'rgba(238, 130, 238, 0.7)'
                            ],
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

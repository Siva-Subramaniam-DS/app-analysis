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

    // Fetch Google Play Store data
    fetch('/api/playstore_genre_counts')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(item => item.genre);
            const counts = data.map(item => item.count);

            new Chart(playstoreChartElement, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Number of Apps',
                        data: counts,
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
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
        .catch(error => console.error('Error fetching playstore genre counts:', error));

    // Fetch Apple App Store data
    fetch('/api/applestore_genre_counts')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(item => item.prime_genre);
            const counts = data.map(item => item.count);

            new Chart(applestoreChartElement, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Number of Apps',
                        data: counts,
                        backgroundColor: 'rgba(153, 102, 255, 0.7)',
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
        .catch(error => console.error('Error fetching applestore genre counts:', error));
}

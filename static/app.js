document.addEventListener('DOMContentLoaded', function() {
    function updateDateTime() {
        const now = new Date();
        document.getElementById('date').textContent = now.toLocaleDateString();
        document.getElementById('time').textContent = now.toLocaleTimeString();
    }
    
    updateDateTime();
    setInterval(updateDateTime, 1000);

    const playstoreChartCtx = document.getElementById('playstoreChart')?.getContext('2d');
    const applestoreChartCtx = document.getElementById('applestoreChart')?.getContext('2d');

    // Define colors
    const colors = [
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(54, 162, 235, 0.2)'
    ];

    const borderColors = [
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(54, 162, 235, 1)'
    ];

    // Fetch data for Play Store and App Store charts
    Promise.all([
        fetch('/api/playstore_comparison').then(response => response.json()),
        fetch('/api/applestore_comparison').then(response => response.json())
    ])
    .then(([playstoreData, applestoreData]) => {
        if (playstoreChartCtx) {
            new Chart(playstoreChartCtx, {
                type: 'bar',
                data: {
                    labels: playstoreData.map(app => app.App),
                    datasets: [{
                        label: 'Reviews',
                        data: playstoreData.map(app => app.Reviews),
                        backgroundColor: colors.slice(0, playstoreData.length),
                        borderColor: borderColors.slice(0, playstoreData.length),
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    }
                }
            });
        }

        if (applestoreChartCtx) {
            new Chart(applestoreChartCtx, {
                type: 'bar',
                data: {
                    labels: applestoreData.map(app => app.track_name),
                    datasets: [{
                        label: 'Rating Count',
                        data: applestoreData.map(app => app.rating_count_tot),
                        backgroundColor: colors.slice(0, applestoreData.length),
                        borderColor: borderColors.slice(0, applestoreData.length),
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    }
                }
            });
        }
    })
    .catch(error => console.error('Error fetching data:', error));
});

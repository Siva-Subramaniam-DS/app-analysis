document.addEventListener("DOMContentLoaded", function() {
    // Fetch Google Play Store data and render chart
    fetch('/api/playstore_comparison')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Google Play Data:', data);
        
        // Transform data if necessary
        const googlePlayLabels = data.map(item => item.label);
        const googlePlayValues = data.map(item => item.value);
        
        if (googlePlayLabels.length && googlePlayValues.length) {
            var ctx = document.getElementById('googleplayChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: googlePlayLabels,
                    datasets: [{
                        label: 'Google Play Store Genres',
                        data: googlePlayValues,
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
                        borderColor: 'rgba(0,0,0, 1)',
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
        } else {
            console.error('Google Play data is missing labels or data.');
        }
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error));

    // Fetch Apple App Store data and render chart
    fetch('/api/applestore_comparison')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Apple Store Data:', data);
        
        // Transform data if necessary
        const appleStoreLabels = data.map(item => item.label);
        const appleStoreValues = data.map(item => item.value);
        
        if (appleStoreLabels.length && appleStoreValues.length) {
            var ctx = document.getElementById('applestoreChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: appleStoreLabels,
                    datasets: [{
                        label: 'Apple App Store Genres',
                        data: appleStoreValues,
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
        } else {
            console.error('Apple Store data is missing labels or data.');
        }
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error));
});

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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('welcomeForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the values of the input fields
        const username = document.getElementById('username').value;
        const startingCity = document.getElementById('startingCity').value;

        // Check if both fields are filled
        if (username && startingCity) {
            // Redirect to the game page with query parameters
            window.location.href = `../Game/game.html`;
        } else {
            // If either field is empty, alert the user (optional)
            alert('Please fill in both fields');
        }
    });
});



// Paima ivestus username ir city, suranda Wikidata ID ir nukreipia i zaidimo puslapi su query parametrais




document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('welcomeForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the values of the input fields
        const username = document.getElementById('username').value;
        const startingCity = document.getElementById('startingCity').value;

        // Check if both fields are filled
        if (username && startingCity) {
            // Fetch the Wikidata ID
            getWikidataID(startingCity).then(itemID => {
                if (itemID) {
                    // Redirect to the game page with query parameters, including the Wikidata item ID
                    window.location.href = `../Game/game.html?username=${encodeURIComponent(username)}&city=${encodeURIComponent(startingCity)}&steps=0&wikidataID=${encodeURIComponent(itemID)}`;
                } else {
                    alert('Wikidata ID not found for the starting city');
                }
            }).catch(error => {
                console.error('Error fetching Wikidata ID:', error);
                alert('Error fetching Wikidata ID');
            });
        } else {
            // If either field is empty, alert the user (optional)
            alert('Please fill in both fields');
        }
    });

    async function getWikidataID(searchTerm) {
        const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(searchTerm)}&language=en&format=json&origin=*`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.search && data.search.length > 0) {
                return data.search[0].id;
            } else {
                return null;
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            return null;
        }
    }
});


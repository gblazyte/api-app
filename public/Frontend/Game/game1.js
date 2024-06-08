document.addEventListener('DOMContentLoaded', function() {
    let username = null;

    
    while (!username) {
        username = prompt('Please enter your username:');
        if (!username) {
            alert('Username is required.');
        }
    }

    const cityInputDiv = document.getElementById('cityInputDiv');
    cityInputDiv.style.display = 'block';

    const cityInput = document.getElementById('cityInput');
    const submitButton = document.getElementById('submitButton');

    submitButton.addEventListener('click', function() {
        const cityName = cityInput.value;
        if (!cityName) {
            alert('Please enter a city name.');
            return;
        }
        startGame(username, cityName);
    });

    const params = new URLSearchParams(window.location.search);
    const currentCity = params.get('city');
    const steps = parseInt(params.get('steps'));

    document.getElementById('steps').textContent = `Steps: ${steps}`;
    document.getElementById('statusText').textContent = `${username}, now you are in ${currentCity}`;
    updateDistance(currentCity);

    fetchNearestCities(currentCity).then(cities => {
        displayCities(cities, username, steps);
    });
});

async function startGame(username, cityName) {
    const params = new URLSearchParams(window.location.search);
    const steps = parseInt(params.get('steps'));

    document.getElementById('steps').textContent = `Steps: ${steps}`;
    document.getElementById('statusText').textContent = `${username}, now you are in ${cityName}`;
    updateDistance(cityName);

    const cities = await fetchNearestCities(cityName);
    displayCities(cities, username, steps);
}

function fetchNearestCities(city) {
    const apiKey = '115b086d63msh292d4c72f75bfe1p1e46a3jsndfe1067eb35';
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${city}&limit=5`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
            'x-rapidapi-key': apiKey
        }
    })
        .then(response => response.json())
        .then(data => data.data.map(city => city.name));
}

function updateDistance(city) {
    const apiKey = '115b086d63msh292d4c72f75bfe1p1e46a3jsndfe1067eb35';
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=Rome`;
    fetch(url, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
            'x-rapidapi-key': apiKey
        }
    })
        .then(response => response.json())
        .then(data => {
            const rome = data.data[0];
            const distanceUrl = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${city}`;
            fetch(distanceUrl, {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
                    'x-rapidapi-key': apiKey
                }
            })
                .then(response => response.json())
                .then(data => {
                    const currentCity = data.data[0];
                    const distance = getDistance(currentCity.latitude, currentCity.longitude, rome.latitude, rome.longitude);
                    const distanceText = document.getElementById('distanceText');
                    distanceText.textContent = `Distance to Rome: ${distance} km`;
                    distanceText.style.color = steps === 0 ? 'white' : (distance < previousDistance ? 'green' : 'red');
                    previousDistance = distance;
                });
        });
}

function displayCities(cities, username, steps) {
    const cityButtons = document.getElementById('cityButtons');
    cityButtons.innerHTML = '';
    cities.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', () => {
            const newSteps = steps + 1;
            window.location.href = `game.html?username=${encodeURIComponent(username)}&city=${encodeURIComponent(city)}&steps=${newSteps}`;
        });
        cityButtons.appendChild(button);
    });
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(2);
}

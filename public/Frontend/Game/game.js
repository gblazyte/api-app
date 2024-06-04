document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    const currentCity = params.get('city');
    const steps = parseInt(params.get('steps'));
    let previousDistance = 0;

    document.getElementById('steps').textContent = `Steps: ${steps}`;
    document.getElementById('statusText').textContent = `${username}, now you are in ${currentCity}`;
    updateDistance(currentCity);

    if (steps < 5) {
        let cities = [];
        if (steps === 4) {
            cities = ['Rome', ...getRandomCities(getAllCities(), 4)];
        } else {
            cities = getRandomCities(getAllCities(), 5);
        }
        displayCities(cities, username, steps);
    } else {
        displayRomeAndOthers(username);
    }

    function getAllCities() {
        return ['Warsaw', 'Minsk', 'Berlin', 'Prague', 'Vienna', 'Madrid', 'Paris', 'Budapest', 'Athens', 'London', 'Lisbon', 'Oslo', 'Stockholm', 'Brussels', 'Amsterdam', 'Dublin', 'Helsinki', 'Copenhagen', 'Moscow', 'Rome', 'Sofia', 'Bucharest', 'Zurich', 'Geneva', 'Bratislava']; // Total of 25 cities including Rome
    }

    function getRandomCities(allCities, count) {
        const cities = [];
        while (cities.length < count) {
            const randomIndex = Math.floor(Math.random() * allCities.length);
            const city = allCities[randomIndex];
            if (!cities.includes(city) && city !== currentCity && (city !== 'Rome' || steps === 4)) {
                cities.push(city);
            }
        }
        return cities;
    }

    function updateDistance(city) {
        // Simulate distance calculation to Rome
        const distances = {
            'Warsaw': 1200,
            'Minsk': 1000,
            'Berlin': 1400,
            'Prague': 900,
            'Vienna': 800,
            'Madrid': 2000,
            'Paris': 1500,
            'Budapest': 1100,
            'Athens': 2500,
            'London': 1700,
            'Lisbon': 1800,
            'Oslo': 1600,
            'Stockholm': 1700,
            'Brussels': 1300,
            'Amsterdam': 1400,
            'Dublin': 1900,
            'Helsinki': 1800,
            'Copenhagen': 1500,
            'Moscow': 2000,
            'Rome': 0,
            'Sofia': 1200,
            'Bucharest': 1500,
            'Zurich': 1000,
            'Geneva': 1100,
            'Bratislava': 1300
        };
        const distance = distances[city];
        const distanceText = document.getElementById('distanceText');
        distanceText.textContent = `Distance to Rome: ${distance} km`;
        distanceText.style.color = steps === 0 ? 'white' : (distance < previousDistance ? 'green' : 'red');
        previousDistance = distance;
    }

    function displayCities(cities, username, steps) {
        const cityButtons = document.getElementById('cityButtons');
        cityButtons.innerHTML = '';
        cities.forEach(city => {
            const button = document.createElement('button');
            button.textContent = city;
            button.addEventListener('click', () => {
                if (city === 'Rome') {
                    alert('Congratulations! You have reached Rome!');
                    // You can add further logic for what happens after reaching Rome, like ending the game.
                } else {
                    const newSteps = steps + 1;
                    window.location.href = `game.html?username=${encodeURIComponent(username)}&city=${encodeURIComponent(city)}&steps=${newSteps}`;
                }
            });
            cityButtons.appendChild(button);
        });
    }

    function displayRomeAndOthers(username) {
        const allCitiesExceptRome = getAllCities().filter(city => city !== 'Rome');
        const cities = getRandomCities(allCitiesExceptRome, 4);
        cities.push('Rome');
        const cityButtons = document.getElementById('cityButtons');
        cityButtons.innerHTML = '';
        cities.forEach(city => {
            const button = document.createElement('button');
            button.textContent = city;
            button.addEventListener('click', () => {
                if (city === 'Rome') {
                    alert('Congratulations! You have reached Rome!');
                    // You can add further logic for what happens after reaching Rome, like ending the game.
                } else {
                    const newSteps = steps + 1;
                    window.location.href = `game.html?username=${encodeURIComponent(username)}&city=${encodeURIComponent(city)}&steps=${newSteps}`;
                }
            });
            cityButtons.appendChild(button);
        });
    }
});

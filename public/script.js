let attemptsLeft = 5;
let selectedCityId = null;
const ROME_CITY_ID = 'Q220'; // WikiData ID for Rome
let username = null;

async function submitUsername() {
  username = document.getElementById('usernameInput').value;
  try {
    const response = await fetch(`/checkUsername?username=${username}`);

    if (!response.ok) {
      throw new Error('Error checking username');
    }
    const { unique } = await response.json();

    if (!unique) {
      throw new Error('Enter unique username');
    } else {
      try {
        await fetch(`/addUsername?username=${username}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error adding username');
        }

        document.getElementById('usernameInput').disabled = true;
        document.getElementById('gameContainer').style.display = 'block';
      } catch (error) {
        console.error('Error adding username:', error.message);
        alert('Error: ' + error.message);
      }
    }
  } catch (error) {
    console.error('Error checking username:', error.message);
    alert('Error: ' + error.message);
  }
}

async function startGame() {
  const cityName = document.getElementById('cityInput').value;
  const wikiDataId = await getWikidataID(cityName);

  // username, cityname

  if (wikiDataId) {
    selectedCityId = wikiDataId;
    attemptsLeft = 100;
    updateAttempts();
    await getNearbyCities(selectedCityId, username, cityName);
  } else {
    alert('No WikiData ID found for the city: ' + cityName);
  }
}

async function getWikidataID(searchTerm) {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
    searchTerm
  )}&language=en&format=json&origin=*`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.search && data.search.length > 0 ? data.search[0].id : null;
  } catch (error) {
    console.error('Fetch operation error:', error);
    return null;
  }
}

async function getNearbyCities(cityId, username, cityName) {
  try {
    const response = await fetch(
      `/nearbyCities?cityId=${cityId}&username=${username}&cityName=${cityName}`
    );

    if (!response.ok) {
      throw new Error('Error fetching nearby cities');
    }
    const data = await response.json();
    displayCities(data.cities);
  } catch (error) {
    console.error('Error fetching nearby cities:', error.message);
    alert('Error: ' + error.message);
  }
}

async function getDistanceToRome(cityId) {
  try {
    const response = await fetch(`/distance?cityId=${cityId}`);
    if (!response.ok) {
      throw new Error('Error fetching distance to Rome');
    }
    const data = await response.json();
    displayDistance(data.distance);
    return data.distance;
  } catch (error) {
    console.error('Error fetching distance to Rome:', error.message);
    alert('Error: ' + error.message);
    return null;
  }
}

function displayCities(cities) {
  const container = document.getElementById('citiesContainer');
  container.innerHTML = '';
  if (cities.length === 0) {
    container.innerHTML = 'No nearby cities found.';
    return;
  }
  cities.forEach((city) => {
    const button = document.createElement('button');
    button.innerText = city.name;
    button.onclick = async () => {
      const distance = await getDistanceToRome(city.id);
      attemptsLeft--;
      updateAttempts();
      if (attemptsLeft === 0 || city.id === ROME_CITY_ID) {
        alert(`Game Over! Distance to Rome: ${distance} km`);
        document.getElementById('gameContainer').style.display = 'none';
      } else {
        selectedCityId = city.id;
        await delay(1500); // Add a delay of 1.5 seconds (1500 milliseconds)
        await getNearbyCities(selectedCityId, username, city.name); // Fetch nearby cities after the delay
      }
    };
    container.appendChild(button);
  });
}

function displayDistance(distance) {
  const container = document.getElementById('distanceContainer');
  container.innerHTML = `Distance to Rome: ${distance} km`;
}

function updateAttempts() {
  const container = document.getElementById('attemptsContainer');
  container.innerHTML = `Attempts left: ${attemptsLeft}`;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

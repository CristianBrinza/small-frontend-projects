const locations = [
  { city: "Chisinau", lat: 47.01, lon: 28.86 },
  { city: "London", lat: 51.5074, lon: -0.1278 },
  { city: "Paris", lat: 48.8566, lon: 2.3522 },
  { city: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { city: "New York", lat: 40.7128, lon: -74.0060 },
  { city: "Sydney", lat: -33.8688, lon: 151.2093 },
  { city: "Moscow", lat: 55.7558, lon: 37.6173 },
  { city: "Berlin", lat: 52.5200, lon: 13.4050 },
  { city: "Dubai", lat: 25.276987, lon: 55.296249 },
  { city: "Buenos Aires", lat: -34.6037, lon: -58.3816 }
];
  
let currentLocationIndex = 0;

const apiUrl = (lat, lon) =>
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,weathercode,precipitation_sum,&timezone=auto`;

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const daysOfWeekShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// DOM Elements
const dayNameElement = document.getElementById("day-name");
const fullDateElement = document.getElementById("full-date");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const changeLocationBtn = document.getElementById("change-location-btn");
const dayNameElements = document.querySelectorAll('.week-list .day-name');
const dayTempElements = document.querySelectorAll('.week-list .day-temp');

// Get today's date and day name
function updateDate() {
  const today = new Date();
  const dayName = daysOfWeek[today.getDay()];
  const fullDate = `${today.getDate()} ${today.toLocaleString("default", { month: "short" })} ${today.getFullYear()}`;

  dayNameElement.textContent = dayName;
  fullDateElement.textContent = fullDate;
}

// Fetch weather data for the current location
async function fetchWeather(lat, lon) {
  try {
    const response = await fetch(apiUrl(lat, lon));
    const data = await response.json();
    updateWeatherUI(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Update the UI with the fetched weather data
function updateWeatherUI(data) {
  if (data.current_weather) {
    const weather = data.current_weather;
    
    // Update current weather details
    locationElement.textContent = `${locations[currentLocationIndex].city}`;
    temperatureElement.textContent = `${Math.round(weather.temperature)}°C`;
    descriptionElement.textContent = getWeatherDescription(weather.weathercode);
    windElement.textContent = `${Math.round(weather.windspeed)} km/h`;

    // Update weather icon if the element exists
    const weatherIcon = document.getElementById("weatherIcon");
    if (weatherIcon) {
      weatherIcon.src = getWeatherIcon(weather.weathercode);
    }

    // Check if humidity exists in the response
    if (weather.relative_humidity !== undefined) {
      humidityElement.textContent = `${Math.round(weather.relative_humidity)} %`; // Display humidity if available
    } else {
      humidityElement.textContent = `N/A`; // Fallback if humidity is not available
    }
  }

  // Handle precipitation and 4-day temperature forecast
  if (data.daily && data.daily.temperature_2m_max && data.daily.weathercode && data.daily.precipitation_sum) {
    const dailyTemperatures = data.daily.temperature_2m_max;
    const dailyWeatherCodes = data.daily.weathercode;
    const dailyPrecipitation = data.daily.precipitation_sum;

    // Update the day names, temperatures, and icons for the next 4 days
    dayNameElements.forEach((dayNameElement, index) => {
      const dayIndex = (new Date().getDay() + index) % 7; // Ensure it wraps around the week
      dayNameElement.textContent = daysOfWeekShort[dayIndex]; // Update day name

      // Update the temperature for each day
      if (dayTempElements[index]) {
        dayTempElements[index].textContent = `${Math.round(dailyTemperatures[index])}°C`;
      }

      // Update the weather icon for each day
      const dayIcon = document.querySelectorAll('.week-list .day-icon')[index];
      if (dayIcon) {
        dayIcon.src = getWeatherIcon(dailyWeatherCodes[index]); // Use weather code to determine the icon
      }
    });

    // Update precipitation
    const precipitationElement = document.getElementById("precipitation");
    if (precipitationElement) {
      precipitationElement.textContent = `${Math.round(dailyPrecipitation[0])} %`; // Use today's precipitation
    }
  } else {
    console.error("Daily forecast data is not available.");
  }
}

// Get the corresponding weather description based on Open-Meteo weather code
function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };
  return descriptions[code] || "Unknown weather";
}

// Get the corresponding weather icon based on Open-Meteo weather code
function getWeatherIcon(code) {
  const iconMap = {
    0: '/weather_app/images/sun.svg',           // Clear sky
    1: '/weather_app/images/sun.svg',           // Mainly clear
    2: '/weather_app/images/partly-cloudy.svg', // Partly cloudy
    3: '/weather_app/images/overcast.svg',      // Overcast
    45: '/weather_app/images/fog.svg',          // Fog
    48: '/weather_app/images/fog.svg',          // Depositing rime fog
    51: '/weather_app/images/drizzle.svg',      // Light drizzle
    53: '/weather_app/images/drizzle.svg',      // Moderate drizzle
    55: '/weather_app/images/drizzle.svg',      // Dense drizzle
    56: '/weather_app/images/freezing-drizzle.svg', // Light freezing drizzle
    57: '/weather_app/images/freezing-drizzle.svg', // Dense freezing drizzle
    61: '/weather_app/images/rain.svg',         // Slight rain
    63: '/weather_app/images/rain.svg',         // Moderate rain
    65: '/weather_app/images/heavy-rain.svg',   // Heavy rain
    66: '/weather_app/images/freezing-rain.svg',// Light freezing rain
    67: '/weather_app/images/freezing-rain.svg',// Heavy freezing rain
    71: '/weather_app/images/snow.svg',         // Slight snow fall
    73: '/weather_app/images/snow.svg',         // Moderate snow fall
    75: '/weather_app/images/heavy-snow.svg',   // Heavy snow fall
    77: '/weather_app/images/snow-grains.svg',  // Snow grains
    80: '/weather_app/images/rain-showers.svg', // Slight rain showers
    81: '/weather_app/images/rain-showers.svg', // Moderate rain showers
    82: '/weather_app/images/violent-rain.svg', // Violent rain showers
    85: '/weather_app/images/snow-showers.svg', // Slight snow showers
    86: '/weather_app/images/heavy-snow-showers.svg', // Heavy snow showers
    95: '/weather_app/images/thunderstorm.svg', // Thunderstorm
    96: '/weather_app/images/thunderstorm-hail.svg', // Thunderstorm with slight hail
    99: '/weather_app/images/thunderstorm-heavy-hail.svg' // Thunderstorm with heavy hail
  };

  return iconMap[code] || '/weather_app/images/sun.svg'; // Default icon if code doesn't match
}

// Change location function to cycle through predefined locations
function changeLocation() {
  currentLocationIndex = (currentLocationIndex + 1) % locations.length;
  const newLocation = locations[currentLocationIndex];
  fetchWeather(newLocation.lat, newLocation.lon);
}

// Initial fetch for the first location
function initializeWeatherApp() {
  updateDate();
  fetchWeather(locations[currentLocationIndex].lat, locations[currentLocationIndex].lon);
}

// Event listener for changing location
changeLocationBtn.addEventListener("click", changeLocation);

document.addEventListener('DOMContentLoaded', () => {
  initializeWeatherApp();
});

// Active class hover functionality
const listItems = document.querySelectorAll('.week-list li');
const firstListItem = listItems[0];

listItems.forEach(item => {
  item.addEventListener('mouseenter', function () {
    removeActiveClass();
    item.classList.add('active');
  });

  item.addEventListener('mouseleave', function () {
    removeActiveClass();
    firstListItem.classList.add('active');
  });
});

function removeActiveClass() {
  listItems.forEach(item => {
    item.classList.remove('active');
  });
}


// Array of random background images
const backgroundImages = [
  '/weather_app/images/random_bg_1.png',
  '/weather_app/images/random_bg_2.png',
  '/weather_app/images/random_bg_3.png',
  '/weather_app/images/random_bg_4.png',
  '/weather_app/images/random_bg_5.png',
  '/weather_app/images/random_bg_6.png',
  '/weather_app/images/random_bg_7.png',
  '/weather_app/images/random_bg_8.png',
  '/weather_app/images/random_bg_9.png',
  '/weather_app/images/random_bg_10.png'
];

// Function to apply a random background image to .weather-side
function applyRandomBackground() {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  const randomBackground = backgroundImages[randomIndex];

  // Apply the background to the .weather-side element
  const weatherSideElement = document.querySelector('.weather-side');
  if (weatherSideElement) {
    weatherSideElement.style.backgroundImage = `url(${randomBackground})`;
  }
}

// Call the function to apply the random background when the page loads
document.addEventListener('DOMContentLoaded', () => {
  applyRandomBackground();
  initializeWeatherApp();
});


// Array of random gradients
const gradients = [
  'linear-gradient(135deg, #72EDF2 10%, #5151E5 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
];

// Function to apply a random gradient to the :root variable
function applyRandomGradient() {
  const randomIndex = Math.floor(Math.random() * gradients.length);
  const randomGradient = gradients[randomIndex];

  // Apply the selected gradient to the --gradient CSS variable
  document.documentElement.style.setProperty('--gradient', randomGradient);
}

// Call the function to apply the random gradient and background image when the page loads
document.addEventListener('DOMContentLoaded', () => {
  applyRandomGradient();
  applyRandomBackground();
  initializeWeatherApp();
});
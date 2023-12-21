const currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const apiKey = 'a3daa13da142468a14acb40abcfe0e4c';

async function getWeather(city) {
    const currentWeatherResponse = await fetch(`${currentWeatherUrl}?q=${city}&appid=${apiKey}&units=metric`);
    const currentWeatherData = await currentWeatherResponse.json();

    const forecastResponse = await fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastResponse.json();

    return { currentWeather: currentWeatherData, forecast: forecastData };
}

async function updateForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < forecastData.list.length; i += 8) {
        const forecastItem = forecastData.list[i];
        const date = new Date(forecastItem.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });

        const forecastItemElement = document.createElement('div');
        forecastItemElement.innerHTML = `
            <div>${day}</div>
            <div>${forecastItem.main.temp.toFixed(1)} °C</div>
            <i class="wi wi-owm-${forecastItem.weather[0].id}"></i>
        `;
        forecastContainer.appendChild(forecastItemElement);
    }
}

function searchWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();

    if (city) {
        updateWeatherByCity(city);
    } else {
        alert('Please enter a city name.');
    }
}

async function updateWeatherByCity(city) {
    try {
        const { currentWeather, forecast } = await getWeather(city);

        document.title = `Weather App - ${currentWeather.name}`;

        document.getElementById('city-title').innerText = `Weather in ${currentWeather.name}`;

        const weatherIcon = document.getElementById('weather-icon');
        weatherIcon.addEventListener('mouseover', () => {
            weatherIcon.style.transform = 'scale(1.2)';
        });

        weatherIcon.addEventListener('mouseout', () => {
            weatherIcon.style.transform = 'scale(1)';
        });

        document.getElementById('location').innerText = `${currentWeather.name}, ${currentWeather.sys.country}`;
        document.getElementById('temperature').innerText = `${currentWeather.main.temp} °C`;
        document.getElementById('description').innerText = currentWeather.weather[0].description;
        document.getElementById('humidity').innerText = `Humidity: ${currentWeather.main.humidity}%`;
        document.getElementById('wind-speed').innerText = `Wind Speed: ${currentWeather.wind.speed} m/s`;
        document.getElementById('weather-icon').className = `wi wi-owm-${currentWeather.weather[0].id}`;
        weatherIcon.className = `wi wi-owm-${currentWeather.weather[0].id}`;

        updateForecast(forecast);
    } catch (error) {
        alert('City not found. Please try again.');
    }
}

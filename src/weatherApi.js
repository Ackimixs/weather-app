async function fetchWeatherData(lat, long) {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric&lang=fr`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

async function convertCityToCoordinates(city) {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json())[0];
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

export { fetchWeatherData, convertCityToCoordinates };
import './App.css'
import {useEffect, useState} from "react";
import {convertCityToCoordinates, fetchWeatherData} from "./weatherApi";

function App() {

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setError] = useState({ hasError: false, message: '' });

  useEffect(() => {
    const mq = window.matchMedia(
        "(prefers-color-scheme: dark)"
    );

    document.body.classList.toggle("dark", mq.matches);
  }, []);

  const save = (data) => {
    localStorage.setItem('weatherData', JSON.stringify(data));
  }

  const fetchWeather = async (lat, long, fallback = false) => {
    setLoading(true);

    try {
      console.error('test');
      const data = await fetchWeatherData(lat, long);
      setWeatherData(data);
      setLoading(false);
      save(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      if (fallback) {
        const weather = localStorage.getItem('weatherData');
        if (weather) {
          setLoading(false);
          setWeatherData(JSON.parse(weather));
          return;
        }
      }
      setLoading(false);
      setError({ hasError: true, message: 'Impossible de récupérer les données météo. Veuillez réessayer plus tard.' });
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      console.log("test");
      fetchWeather(latitude, longitude, true);
    }, (error) => {
      console.error('Error getting geolocation:', error);
      const weather = localStorage.getItem('weatherData');
      if (weather) {
        setLoading(false);
        setWeatherData(JSON.parse(weather));
        return;
      }
      setError({ hasError: true, message: 'Impossible de récupérer votre position. Veuillez autoriser l\'accès à la géolocalisation.' });
      setLoading(false);
    }, {timeout: 1000});
  }, []);

  const getAdvice = (weather) => {
    if (weather.includes('Rain')) {
      return 'N\'oubliez pas votre parapluie !';
    } else if (weather.includes('Snow')) {
      return 'Mettez votre manteau et vos gants !';
    } else if (weather.includes('Clear')) {
      return 'Portez des vêtements légers et profitez du soleil !';
    } else if (weather.includes('Clouds')) {
      return 'Portez une veste légère, il pourrait faire frais !';
    } else {
      return 'Habillez-vous confortablement et profitez de votre journée !';
    }
  }

  return (
    <div className="weather-card">
      <div className="search-bar">
        <div className="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
               stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
          </svg>
        </div>
        <input
            type="text"
            placeholder="Rechercher"
            className="search-input"
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                try {
                  const { lat, lon } = await convertCityToCoordinates(e.target.value);
                  await fetchWeather(lat, lon);
                } catch (error) {
                  console.error('Error fetching weather data:', error);
                  setError({
                    hasError: true,
                    message: 'Impossible de récupérer les données météo pour cette ville. Veuillez réessayer.'
                  });
                }
              }
            }}
        />
      </div>

      {
        loading ?
            <div className="loading">
              <span>Chargement ...</span>
            </div>
            : err.hasError ?
                <div className="loading">
                  <span>{err.message}</span>
                </div>
            :
              <>
                <div className="location">
                  <span className="city">{weatherData.name.toUpperCase()}</span> · <span
                    className="country">{weatherData.sys.country.toUpperCase()}</span>
                </div>
                <hr />

                <div className="temperature-section">
                  <div>
                    <div className="temperature">{weatherData.main.temp}°C</div>
                    <div className="weather-description">{weatherData.weather[0].description}</div>
                  </div>
                  <img
                      src={`https://openweathermap.org/payload/api/media/file/${weatherData.weather[0].icon}.png`}
                      alt="Weather Icon"
                      className="weather-icon"
                  />
                </div>
                <hr />
                <div className="advice">{getAdvice(weatherData.weather[0].main)}</div>
              </>
      }
    </div>
  )
}

export default App

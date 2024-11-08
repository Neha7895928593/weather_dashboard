import React, { useState, useEffect } from 'react';
import { fetchWeatherData, fetchForecastData, getFavorites, addFavorite, removeFavorite } from '../services/api';
import { FaHeart, FaTrashAlt, FaSun, FaCloudSun, FaCloudRain } from 'react-icons/fa';

function WeatherDashboard() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState('metric');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const fetchWeather = async (cityName) => {
    const weather = await fetchWeatherData(cityName, unit);
    const forecast = await fetchForecastData(cityName, unit);
    if (weather && forecast) {
      setWeatherData(weather);
      setForecastData(forecast);
    }
  };

  const handleSearch = () => {
    if (city.trim()) fetchWeather(city);
  };

  const handleAddFavorite = async () => {
    if (city && !favorites.find((fav) => fav.city === city)) {
      const newFavorite = await addFavorite(city);
      if (newFavorite) setFavorites((prev) => [...prev, newFavorite]);
    }
  };

  const handleRemoveFavorite = async (cityId) => {
    const removed = await removeFavorite(cityId);
    if (removed) setFavorites((prev) => prev.filter((fav) => fav.id !== cityId));
  };

  const toggleUnit = () => setUnit(unit === 'metric' ? 'imperial' : 'metric');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-500 via-cyan-500 to-indigo-500 p-8 text-gray-900 font-sans text-white">
      <h1 className="text-6xl font-extrabold text-center mb-12 text-white drop-shadow-lg">Weather Dashboard</h1>

      {/* Search and Unit Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 w-full max-w-4xl">
        <div className="flex w-full md:w-auto">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="px-5 py-3 w-full md:w-72 border-2 border-teal-200 rounded-lg text-black focus:outline-none focus:ring-4 focus:ring-teal-400"
          />
          <button onClick={handleSearch} className="px-6 py-3 bg-teal-700 text-white rounded-r-md hover:bg-teal-800 transition duration-300">
            Search
          </button>
        </div>
        <button onClick={toggleUnit} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-300">
          {unit === 'metric' ? '°C / °F' : '°F / °C'}
        </button>
      </div>

      {/* Main Weather Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        {/* Current Weather */}
        {weatherData && (
          <div className="p-8 bg-white bg-opacity-80 rounded-xl shadow-2xl hover:shadow-lg transition-transform transform hover:scale-105 text-center text-gray-800">
            <h2 className="text-4xl font-semibold text-teal-700 mb-4">{weatherData.name}</h2>
            <p className="text-6xl font-bold mb-4">{weatherData.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
            <div className="flex items-center justify-center text-3xl space-x-2 mb-4">
              {weatherData.weather[0].main === 'Clear' && <FaSun className="text-yellow-500" />}
              {weatherData.weather[0].main === 'Clouds' && <FaCloudSun className="text-blue-300" />}
              {weatherData.weather[0].main === 'Rain' && <FaCloudRain className="text-blue-500" />}
              <p>{weatherData.weather[0].description}</p>
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {forecastData.length > 0 && (
          <div className="col-span-2 p-8 bg-white bg-opacity-80 rounded-xl shadow-2xl hover:shadow-lg transition-transform transform hover:scale-105">
            <h3 className="text-3xl font-semibold text-teal-700 mb-6 text-center">5-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {forecastData.map((day, index) => (
                <div key={index} className="bg-teal-100 p-4 rounded-lg shadow-md hover:shadow-lg text-center">
                  <p className="font-semibold text-gray-700">{day.date}</p>
                  <p className="text-2xl  text-blue-500 font-bold">{day.temp}°</p>
                  <p className="text-gray-500">{day.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Favorite Cities Section */}
      <div className="mt-16 w-full max-w-7xl">
        <h3 className="text-3xl font-bold text-teal-700 mb-8 text-center">Favorite Cities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              onClick={() => fetchWeather(fav.city)}
              className="p-6 bg-white bg-opacity-80 rounded-xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{fav.city}</h4>
                    <p className="text-gray-500">{fav.description}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(fav.id);
                  }}
                  className="text-red-500 hover:text-red-700 transition duration-300"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleAddFavorite} className="mt-6 px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition flex items-center gap-2 mx-auto">
          <FaHeart /> Add to Favorites
        </button>
      </div>
    </div>
  );
}

export default WeatherDashboard;

import axios from 'axios';

const API_KEY = '3cc4a65b8fd8e3f35bd050344f268144';
const API_BASE_URL = 'http://localhost:5000';

export const fetchWeatherData = async (city, unit) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data", error);
    return null;
  }
};

export const fetchForecastData = async (city, unit) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
    );
    return response.data.list
      .map((item) => ({
        date: new Date(item.dt_txt).toLocaleDateString(),
        temp: item.main.temp,
        description: item.weather[0].description,
      }))
      .slice(0, 5);
  } catch (error) {
    console.error("Error fetching forecast data", error);
    return [];
  }
};

// CRUD operations for managing favorite cities
export const getFavorites = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/favorites`);
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites", error);
    return [];
  }
};

export const addFavorite = async (city) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/favorites`, { city });
    return response.data;
  } catch (error) {
    console.error("Error adding favorite city", error);
    return null;
  }
};

export const removeFavorite = async (cityId) => {
  try {
    await axios.delete(`${API_BASE_URL}/favorites/${cityId}`);
    return true;
  } catch (error) {
    console.error("Error removing favorite city", error);
    return false;
  }
};

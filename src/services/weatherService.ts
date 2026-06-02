import axios from 'axios';
import { OpenWeatherResponse, WeatherData } from '../types/weather';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

function getApiKey() {
  return process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY?.trim();
}

function getDefaultCity() {
  return process.env.EXPO_PUBLIC_DEFAULT_CITY || 'Sao Paulo,BR';
}

function hasValidApiKey(apiKey?: string) {
  if (!apiKey) {
    return false;
  }

  const normalizedApiKey = apiKey.trim();

  const invalidValues = [
    '',
    'SUA_CHAVE_AQUI',
    'SUA_CHAVE_OPENWEATHER_AQUI',
    'SUA_KEY_COPIADA_AQUI',
    'SUA_CHAVE_OPENWEATHER_AQUI_SEM_ASPAS',
  ];

  return !invalidValues.includes(normalizedApiKey);
}

function normalizeWeatherData(data: OpenWeatherResponse): WeatherData {
  return {
    city: data.name,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: Number(data.wind.speed.toFixed(1)),
    condition: data.weather[0]?.main || 'Indisponível',
    description: data.weather[0]?.description || 'Sem descrição disponível',
    updatedAt: new Date().toISOString(),
  };
}

export async function getCurrentWeather(city?: string): Promise<WeatherData> {
  const apiKey = getApiKey();
  const selectedCity = city?.trim() || getDefaultCity();

  if (!hasValidApiKey(apiKey)) {
    return getMockWeather(selectedCity);
  }

  const response = await axios.get<OpenWeatherResponse>(OPENWEATHER_BASE_URL, {
    params: {
      q: selectedCity,
      appid: apiKey,
      units: 'metric',
      lang: 'pt_br',
    },
  });

  return normalizeWeatherData(response.data);
}

export function getMockWeather(city = getDefaultCity()): WeatherData {
  return {
    city,
    temperature: 24,
    feelsLike: 25,
    humidity: 68,
    windSpeed: 3.4,
    condition: 'Clouds',
    description: 'nuvens dispersas',
    updatedAt: new Date().toISOString(),
  };
}
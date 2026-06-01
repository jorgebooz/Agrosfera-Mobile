import axios from 'axios';
import { APODData, NASAAPODResponse } from '../types/nasa';

const NASA_APOD_BASE_URL = 'https://api.nasa.gov/planetary/apod';

function getApiKey() {
  return process.env.EXPO_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
}

function normalizeAPODData(data: NASAAPODResponse): APODData {
  return {
    title: data.title,
    explanation: data.explanation,
    url: data.url,
    mediaType:
      data.media_type === 'image'
        ? 'image'
        : data.media_type === 'video'
          ? 'video'
          : 'other',
    date: data.date,
  };
}

export async function getAPOD(): Promise<APODData> {
  try {
    const response = await axios.get<NASAAPODResponse>(NASA_APOD_BASE_URL, {
      params: {
        api_key: getApiKey(),
      },
    });

    return normalizeAPODData(response.data);
  } catch {
    return getMockAPOD();
  }
}

export function getMockAPOD(): APODData {
  return {
    title: 'Agricultura em ambientes extremos',
    explanation:
      'O monitoramento de recursos em ambientes espaciais inspira soluções sustentáveis na Terra, especialmente em cultivo controlado, economia de água e automação agrícola.',
    url: 'https://images-assets.nasa.gov/image/iss063e053998/iss063e053998~medium.jpg',
    mediaType: 'image',
    date: new Date().toISOString().split('T')[0],
  };
}
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SensorHistoryRecord } from '../types/history';

const HISTORY_STORAGE_KEY = '@agrosfera:sensor-history';

export async function getSensorHistory(): Promise<SensorHistoryRecord[]> {
  const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);

  if (!storedHistory) {
    return [];
  }

  return JSON.parse(storedHistory) as SensorHistoryRecord[];
}

export async function saveSensorHistoryRecord(
  record: SensorHistoryRecord
): Promise<void> {
  const currentHistory = await getSensorHistory();

  const updatedHistory = [record, ...currentHistory].slice(0, 10);

  await AsyncStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify(updatedHistory)
  );
}

export async function clearSensorHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
}
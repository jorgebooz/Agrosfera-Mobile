import { SensorData } from './sensor';

export interface SensorHistoryRecord {
  id: string;
  createdAt: string;
  sensors: SensorData[];
}
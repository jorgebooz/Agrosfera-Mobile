export type SensorStatus = 'ideal' | 'attention' | 'critical';

export type SensorType =
  | 'temperature'
  | 'soilHumidity'
  | 'luminosity'
  | 'airQuality'
  | 'waterConsumption';

export interface SensorData {
  id: string;
  name: string;
  type: SensorType;
  value: number;
  unit: string;
  status: SensorStatus;
  description: string;
  updatedAt: string;
}
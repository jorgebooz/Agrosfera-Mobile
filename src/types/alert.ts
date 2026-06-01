import { SensorStatus, SensorType } from './sensor';

export interface CultivationAlert {
  id: string;
  sensorType: SensorType;
  title: string;
  description: string;
  recommendation: string;
  severity: Exclude<SensorStatus, 'ideal'>;
  createdAt: string;
}
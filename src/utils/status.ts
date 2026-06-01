import { SensorStatus } from '../types/sensor';

export function getStatusLabel(status: SensorStatus): string {
  switch (status) {
    case 'ideal':
      return 'Ideal';
    case 'attention':
      return 'Atenção';
    case 'critical':
      return 'Crítico';
    default:
      return 'Indefinido';
  }
}
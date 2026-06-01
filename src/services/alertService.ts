import { CultivationAlert } from '../types/alert';
import { SensorData } from '../types/sensor';

export function generateAlertsFromSensors(
  sensors: SensorData[]
): CultivationAlert[] {
  const now = new Date().toISOString();

  return sensors
    .filter((sensor) => sensor.status !== 'ideal')
    .map((sensor) => {
      const severity = sensor.status === 'critical' ? 'critical' : 'attention';

      switch (sensor.type) {
        case 'temperature':
          return {
            id: `alert-${sensor.id}`,
            sensorType: sensor.type,
            title:
              severity === 'critical'
                ? 'Temperatura em nível crítico'
                : 'Temperatura exige atenção',
            description: `A temperatura atual está em ${sensor.value}${sensor.unit}.`,
            recommendation:
              severity === 'critical'
                ? 'Verifique imediatamente ventilação, sombreamento e controle térmico do ambiente.'
                : 'Acompanhe a variação da temperatura e ajuste o ambiente se necessário.',
            severity,
            createdAt: now,
          };

        case 'soilHumidity':
          return {
            id: `alert-${sensor.id}`,
            sensorType: sensor.type,
            title:
              severity === 'critical'
                ? 'Umidade do solo em nível crítico'
                : 'Umidade do solo exige atenção',
            description: `A umidade atual do solo está em ${sensor.value}${sensor.unit}.`,
            recommendation:
              severity === 'critical'
                ? 'Ajuste o sistema de irrigação e verifique risco de ressecamento ou excesso de água.'
                : 'Monitore a irrigação para manter o solo dentro da faixa ideal.',
            severity,
            createdAt: now,
          };

        case 'luminosity':
          return {
            id: `alert-${sensor.id}`,
            sensorType: sensor.type,
            title:
              severity === 'critical'
                ? 'Luminosidade em nível crítico'
                : 'Luminosidade exige atenção',
            description: `A luminosidade atual está em ${sensor.value}${sensor.unit}.`,
            recommendation:
              severity === 'critical'
                ? 'Verifique a iluminação artificial, sombreamento e exposição do cultivo.'
                : 'Ajuste gradualmente a exposição à luz para melhorar a fotossíntese.',
            severity,
            createdAt: now,
          };

        case 'airQuality':
          return {
            id: `alert-${sensor.id}`,
            sensorType: sensor.type,
            title:
              severity === 'critical'
                ? 'Qualidade do ar em nível crítico'
                : 'Qualidade do ar exige atenção',
            description: `O índice de qualidade do ar está em ${sensor.value}${sensor.unit}.`,
            recommendation:
              severity === 'critical'
                ? 'Inspecione ventilação, filtros e circulação de ar do ambiente controlado.'
                : 'Acompanhe a circulação de ar e considere ajustes preventivos.',
            severity,
            createdAt: now,
          };

        case 'waterConsumption':
          return {
            id: `alert-${sensor.id}`,
            sensorType: sensor.type,
            title:
              severity === 'critical'
                ? 'Consumo hídrico elevado'
                : 'Consumo hídrico acima do ideal',
            description: `O consumo atual está em ${sensor.value}${sensor.unit}.`,
            recommendation:
              severity === 'critical'
                ? 'Verifique vazamentos, irrigação excessiva e desperdício no sistema.'
                : 'Acompanhe o consumo de água e avalie ajustes na irrigação.',
            severity,
            createdAt: now,
          };

        default:
          return {
            id: `alert-${sensor.id}`,
            sensorType: sensor.type,
            title: 'Sensor exige atenção',
            description: `${sensor.name} está fora da faixa ideal.`,
            recommendation: 'Verifique o sensor e acompanhe a próxima leitura.',
            severity,
            createdAt: now,
          };
      }
    });
}
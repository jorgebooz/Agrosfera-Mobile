import { SensorData, SensorStatus, SensorType } from '../types/sensor';

function getRandomValue(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(1));
}

function getStatus(type: SensorType, value: number): SensorStatus {
  switch (type) {
    case 'temperature':
      if (value < 18 || value > 32) return 'critical';
      if (value < 21 || value > 29) return 'attention';
      return 'ideal';

    case 'soilHumidity':
      if (value < 35 || value > 85) return 'critical';
      if (value < 45 || value > 75) return 'attention';
      return 'ideal';

    case 'luminosity':
      if (value < 250 || value > 900) return 'critical';
      if (value < 400 || value > 750) return 'attention';
      return 'ideal';

    case 'airQuality':
      if (value < 45) return 'critical';
      if (value < 65) return 'attention';
      return 'ideal';

    case 'waterConsumption':
      if (value > 18) return 'critical';
      if (value > 13) return 'attention';
      return 'ideal';

    default:
      return 'ideal';
  }
}

export function generateSimulatedSensors(): SensorData[] {
  const now = new Date().toISOString();

  const temperature = getRandomValue(17, 34);
  const soilHumidity = getRandomValue(30, 90);
  const luminosity = getRandomValue(200, 950);
  const airQuality = getRandomValue(40, 100);
  const waterConsumption = getRandomValue(8, 20);

  return [
    {
      id: 'sensor-temperature',
      name: 'Temperatura do ambiente',
      type: 'temperature',
      value: temperature,
      unit: '°C',
      status: getStatus('temperature', temperature),
      description: 'Mede a temperatura interna do ambiente de cultivo.',
      updatedAt: now,
    },
    {
      id: 'sensor-soil-humidity',
      name: 'Umidade do solo',
      type: 'soilHumidity',
      value: soilHumidity,
      unit: '%',
      status: getStatus('soilHumidity', soilHumidity),
      description: 'Indica a umidade disponível para as raízes.',
      updatedAt: now,
    },
    {
      id: 'sensor-luminosity',
      name: 'Luminosidade',
      type: 'luminosity',
      value: luminosity,
      unit: 'lux',
      status: getStatus('luminosity', luminosity),
      description: 'Monitora a intensidade de luz recebida pelo cultivo.',
      updatedAt: now,
    },
    {
      id: 'sensor-air-quality',
      name: 'Qualidade do ar',
      type: 'airQuality',
      value: airQuality,
      unit: '%',
      status: getStatus('airQuality', airQuality),
      description: 'Avalia as condições gerais do ar no ambiente controlado.',
      updatedAt: now,
    },
    {
      id: 'sensor-water-consumption',
      name: 'Consumo hídrico',
      type: 'waterConsumption',
      value: waterConsumption,
      unit: 'L/h',
      status: getStatus('waterConsumption', waterConsumption),
      description: 'Acompanha o consumo de água do sistema de cultivo.',
      updatedAt: now,
    },
  ];
}
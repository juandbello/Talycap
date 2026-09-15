export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

export interface WeatherResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
}

export interface WeatherRow {
  city: string;
  temperature: number;
  weatherCode: number;
}

export function weatherLabel(code: number): string {
  if (code === 0) return '☀️ Despejado';
  if ([1, 2].includes(code)) return '⛅ Parcialmente nublado';
  if (code === 3) return '☁️ Nublado';
  if ([45, 48].includes(code)) return '🌫️ Neblina';
  if ([51, 53, 55].includes(code)) return '🌦️ Llovizna';
  if ([56, 57, 66, 67].includes(code)) return '🌧️ Lluvia helada';
  if ([61, 63, 65].includes(code)) return '🌧️ Lluvia';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️ Nieve';
  if ([80, 81, 82].includes(code)) return '🌧️ Chubascos';
  if ([95, 96, 99].includes(code)) return '⛈️ Tormenta';
  return 'Estado desconocido';
}

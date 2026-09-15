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
  city: string; temperature: number;
  weatherCode: number;
}

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';
import { City, WeatherResponse, WeatherRow } from '../models/weather.model';
import { environment } from '../../../enviroments/enviroment';
@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = environment.weatherFeatures;
  private readonly cities: City[] = [
    { name: 'Bogotá', latitude: 4.711, longitude: -74.0721 }, { name: 'Medellín', latitude: 6.2442, longitude: -75.5812 },
    { name: 'Cali', latitude: 3.4516, longitude: -76.532 }, { name: 'Barranquilla', latitude: 10.9685, longitude: -74.7813 },
    { name: 'Cartagena', latitude: 10.391, longitude: -75.4794 }, { name: 'Bucaramanga', latitude: 7.1193, longitude: -73.1227 },
    { name: 'Manizales', latitude: 5.0703, longitude: -75.5138 }, { name: 'Pereira', latitude: 4.8143, longitude: -75.6946 },
    { name: 'Santa Marta', latitude: 11.2408, longitude: -74.199 }, { name: 'Cúcuta', latitude: 7.8939, longitude: -72.5078 }
  ];
    currentWeather() {
    return forkJoin(
      this.cities.map((city) =>
        this.http.get<WeatherResponse>(this.endpoint, {
          params: new HttpParams()
            .set('latitude', city.latitude)
            .set('longitude', city.longitude)
            .set('current', 'temperature_2m,weather_code')
        }).pipe(
          map((response): WeatherRow => ({
            city: city.name,
            temperature: response.current.temperature_2m,
            weatherCode: response.current.weather_code
          }))
        )
      )
    );
  }
}

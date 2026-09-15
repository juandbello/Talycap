import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { CatalogoService } from '../../services/catalogo.service';
import { WeatherRow } from '../../models/weather.model';
import { WeatherService } from '../../services/weather.service';
type Dataset = 'movies' | 'weather';
@Component({ selector: 'app-catalogo-list', standalone: true, imports: [DecimalPipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSnackBarModule, MatButtonToggleModule], templateUrl: './catalogo-list.component.html', styleUrl: './catalogo-list.component.css' })
export class CatalogoListComponent implements OnInit {
  private readonly catalogo = inject(CatalogoService); private readonly weather = inject(WeatherService); private readonly snack = inject(MatSnackBar);
  readonly movieSearch = new FormControl('', { nonNullable: true }); readonly weatherSearch = new FormControl('', { nonNullable: true });
  dataset: Dataset = 'weather'; movies: Movie[] = []; weatherRows: WeatherRow[] = []; loading = false; total = 0; pageIndex = 0; readonly weatherPageSize = 5;
  ngOnInit() { this.movieSearch.valueChanges.pipe(debounceTime(350), distinctUntilChanged()).subscribe(() => { if (this.dataset === 'movies') { this.pageIndex = 0; this.loadMovies(); } }); this.weatherSearch.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe(() => this.pageIndex = 0); this.loadWeather(); }
  changeDataset(value: Dataset) { this.dataset = value; this.pageIndex = 0; value === 'movies' ? this.loadMovies() : this.loadWeather(); }
  private loadMovies() { this.loading = true; const term = this.movieSearch.value.trim(); const request = term ? this.catalogo.search(term, this.pageIndex) : this.catalogo.popular(this.pageIndex); request.subscribe({ next: response => { this.movies = response.results; this.total = response.total_pages * 20; this.loading = false; }, error: () => { this.loading = false; this.movies = []; this.snack.open('No fue posible cargar películas desde TVMaze.', 'Cerrar', { duration: 5000 }); } }); }
  private loadWeather() { this.loading = true; this.weather.currentWeather().subscribe({ next: rows => { this.weatherRows = rows; this.loading = false; }, error: () => { this.weatherRows = []; this.loading = false; this.snack.open('No fue posible cargar el clima.', 'Cerrar', { duration: 5000 }); } }); }
  onPage(event: PageEvent) { this.pageIndex = event.pageIndex; if (this.dataset === 'movies') this.loadMovies(); }
  poster(movie: Movie) { return movie.poster_path ?? 'https://placehold.co/92x138/e2e8f0/475569?text=Sin+imagen'; }
  weatherLabel(code: number) { if (code <= 1) return '☀️ Despejado'; if (code <= 3) return '⛅ Parcialmente nublado'; if (code <= 48) return '🌫️ Neblina'; if (code <= 67) return '🌧️ Lluvia'; return '⛈️ Tormenta'; }
  get filteredWeatherRows() { const term = this.weatherSearch.value.trim().toLocaleLowerCase(); return this.weatherRows.filter(row => row.city.toLocaleLowerCase().includes(term)); }
  get displayedWeatherRows() { const start = this.pageIndex * this.weatherPageSize; return this.filteredWeatherRows.slice(start, start + this.weatherPageSize); }
}

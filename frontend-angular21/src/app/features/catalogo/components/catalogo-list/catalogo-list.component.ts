import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { CatalogoService } from '../../services/catalogo.service';
import { WeatherRow, weatherLabel } from '../../models/weather.model';
import { WeatherService } from '../../services/weather.service';

type Dataset = 'movies' | 'weather';

@Component({
  selector: 'app-catalogo-list',
  standalone: true,
  imports: [
    DecimalPipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatProgressSpinnerModule, MatSnackBarModule,
    MatButtonToggleModule, MatTableModule
  ],
  templateUrl: './catalogo-list.component.html',
  styleUrl: './catalogo-list.component.css'
})
export class CatalogoListComponent implements OnInit {
  private readonly catalogo = inject(CatalogoService);
  private readonly weather = inject(WeatherService);
  private readonly snack = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  private request?: Subscription;

  readonly movieSearch = new FormControl('', { nonNullable: true });
  readonly weatherSearch = new FormControl('', { nonNullable: true });
  readonly movieColumns = ['title', 'release', 'rating'];
  readonly weatherColumns = ['city', 'temperature', 'condition'];
  readonly weatherPageSize = 5;
  readonly moviePageSize = 20;
  readonly weatherLabel = weatherLabel;

  dataset: Dataset = 'weather';
  movies: Movie[] = [];
  weatherRows: WeatherRow[] = [];
  loading = false;
  total = 0;
  pageIndex = 0;

  ngOnInit(): void {
    this.movieSearch.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      if (this.dataset === 'movies') {
        this.pageIndex = 0;
        this.loadMovies();
      }
    });

    this.weatherSearch.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      if (this.dataset === 'weather') this.pageIndex = 0;
    });

    this.loadWeather();
  }

  changeDataset(value: Dataset): void {
    this.dataset = value;
    this.pageIndex = 0;
    value === 'movies' ? this.loadMovies() : this.loadWeather();
  }

  private loadMovies(): void {
    this.request?.unsubscribe();
    this.loading = true;
    const term = this.movieSearch.value.trim();
    const request = term
      ? this.catalogo.search(term, this.pageIndex)
      : this.catalogo.popular(this.pageIndex);

    this.request = request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: response => {
        this.movies = response.results;
        this.total = response.total_results;
        this.loading = false;
      },
      error: () => {
        this.movies = [];
        this.total = 0;
        this.loading = false;
        this.snack.open('No fue posible cargar las series. Intenta de nuevo.', 'Cerrar', { duration: 5000 });
      }
    });
  }

  private loadWeather(): void {
    this.request?.unsubscribe();
    this.loading = true;
    this.request = this.weather.currentWeather().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: rows => {
        this.weatherRows = rows;
        this.loading = false;
      },
      error: () => {
        this.weatherRows = [];
        this.loading = false;
        this.snack.open('No fue posible cargar el clima. Intenta de nuevo.', 'Cerrar', { duration: 5000 });
      }
    });
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    if (this.dataset === 'movies') this.loadMovies();
  }

  get filteredWeatherRows(): WeatherRow[] {
    const normalize = (value: string) =>
      value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
    const term = normalize(this.weatherSearch.value.trim());
    return this.weatherRows.filter(row => normalize(row.city).includes(term));
  }

  get displayedWeatherRows(): WeatherRow[] {
    const start = this.pageIndex * this.weatherPageSize;
    return this.filteredWeatherRows.slice(start, start + this.weatherPageSize);
  }
}

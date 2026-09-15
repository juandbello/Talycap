import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, Subject, throwError } from 'rxjs';
import { CatalogoListComponent } from './catalogo-list.component';
import { CatalogoService } from '../../services/catalogo.service';
import { WeatherService } from '../../services/weather.service';
import { MovieResponse } from '../../models/movie.model';
import { WeatherRow, weatherLabel } from '../../models/weather.model';

describe('CatalogoListComponent', () => {
  const rows: WeatherRow[] = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Pereira']
    .map(city => ({ city, temperature: 20, weatherCode: 0 }));
  const emptyPage: MovieResponse = { page: 1, total_pages: 0, total_results: 0, results: [] };
  let weather: { currentWeather: ReturnType<typeof vi.fn> };
  let catalogo: { popular: ReturnType<typeof vi.fn>; search: ReturnType<typeof vi.fn> };
  let snack: { open: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    weather = { currentWeather: vi.fn(() => of(rows)) };
    catalogo = { popular: vi.fn(() => of(emptyPage)), search: vi.fn(() => of(emptyPage)) };
    snack = { open: vi.fn() };
    TestBed.configureTestingModule({
      imports: [CatalogoListComponent],
      providers: [
        { provide: WeatherService, useValue: weather },
        { provide: CatalogoService, useValue: catalogo },
        { provide: MatSnackBar, useValue: snack }
      ]
    }).overrideComponent(CatalogoListComponent, {
      add: { providers: [{ provide: MatSnackBar, useValue: snack }] }
    });
  });

  it('muestra una tabla Material de clima paginada y filtra sin exigir tildes', () => {
    const fixture = TestBed.createComponent(CatalogoListComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(fixture.nativeElement.querySelector('table[mat-table]')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('tr[mat-row]').length).toBe(5);
    component.onPage({ pageIndex: 1, pageSize: 5, length: rows.length });
    fixture.detectChanges();
    expect(component.displayedWeatherRows[0].city).toBe('Pereira');
    component.pageIndex = 0;
    component.weatherSearch.setValue('bogota');
    fixture.detectChanges();
    expect(component.displayedWeatherRows.map(row => row.city)).toEqual(['Bogotá']);
  });

  it('usa el total exacto de series y muestra un estado vacío', () => {
    catalogo.popular.mockReturnValue(of({ ...emptyPage, total_results: 23, total_pages: 2 }));
    const fixture = TestBed.createComponent(CatalogoListComponent);
    fixture.detectChanges();
    fixture.componentInstance.changeDataset('movies');
    fixture.detectChanges();
    expect(fixture.componentInstance.total).toBe(23);
    expect(fixture.nativeElement.textContent).toContain('No hay resultados');
  });

  it('descarta una respuesta pendiente al cambiar de sección', () => {
    const pending = new Subject<MovieResponse>();
    catalogo.popular.mockReturnValue(pending);
    const fixture = TestBed.createComponent(CatalogoListComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.changeDataset('movies');
    expect(component.loading).toBe(true);
    component.changeDataset('weather');
    pending.next({ ...emptyPage, total_results: 99 });
    expect(component.total).toBe(0);
    expect(component.loading).toBe(false);
    expect(component.weatherRows).toHaveLength(6);
  });

  it('muestra un aviso y termina la carga si falla el clima', () => {
    weather.currentWeather.mockReturnValue(throwError(() => new Error('Sin conexión')));
    const fixture = TestBed.createComponent(CatalogoListComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.loading).toBe(false);
    expect(fixture.componentInstance.weatherRows).toEqual([]);
    expect(snack.open).toHaveBeenCalledOnce();
  });

  it('distingue nieve, lluvia y tormenta según los códigos del proveedor', () => {
    expect(weatherLabel(73)).toContain('Nieve');
    expect(weatherLabel(63)).toContain('Lluvia');
    expect(weatherLabel(95)).toContain('Tormenta');
    expect(weatherLabel(999)).toContain('desconocido');
  });
});

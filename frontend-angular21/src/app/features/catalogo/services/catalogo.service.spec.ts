import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CatalogoService } from './catalogo.service';
import { environment } from '../../../enviroments/enviroment';

describe('CatalogoService', () => {
  let service: CatalogoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(CatalogoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('pagina el catálogo con el total real y reutiliza el bloque descargado', () => {
    const shows = Array.from({ length: 23 }, (_, id) => ({
      id, name: `Serie ${id}`, premiered: null, rating: { average: null }, image: null
    }));
    service.popular(0).subscribe(page => {
      expect(page.total_results).toBe(23);
      expect(page.results).toHaveLength(20);
      expect(page.results[0].poster_path).toBeNull();
    });
    const request = http.expectOne(req => req.url === environment.catalogoFeatures);
    expect(request.request.params.get('page')).toBe('0');
    request.flush(shows);

    service.popular(1).subscribe(page => {
      expect(page.results).toHaveLength(3);
      expect(page.results[0].id).toBe(20);
      expect(page.total_results).toBe(23);
    });
    http.expectNone(req => req.url === environment.catalogoFeatures);
  });

  it('envía el filtro y devuelve cero resultados para una búsqueda vacía', () => {
    service.search('inexistente', 0).subscribe(page => {
      expect(page.total_results).toBe(0);
      expect(page.results).toEqual([]);
    });
    const request = http.expectOne(req => req.url === environment.catalogoSearch);
    expect(request.request.params.get('q')).toBe('inexistente');
    request.flush([]);
  });

  it('propaga los errores HTTP para que la pantalla muestre el aviso', () => {
    const error = vi.fn();
    service.search('Girls', 0).subscribe({ error });
    http.expectOne(req => req.url === environment.catalogoSearch)
      .flush('Error', { status: 503, statusText: 'Service Unavailable' });
    expect(error).toHaveBeenCalledOnce();
  });
});

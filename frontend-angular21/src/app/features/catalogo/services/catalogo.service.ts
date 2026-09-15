import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { Movie, MovieResponse } from '../models/movie.model';
import { environment } from '../../../enviroments/enviroment';

interface TvMazeShow { id: number; name: string; premiered: string | null; rating: { average: number | null }; image: { medium: string } | null; }
interface TvMazeSearchResult { show: TvMazeShow; }

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.catalogoFeatures;
  private readonly pageSize = 20;
  popular(pageIndex: number) {
    return this.http.get<TvMazeShow[]>(this.api, { params: new HttpParams().set('page', 1) }).pipe(
      map(shows => this.toPage(shows, pageIndex))
    );
  }
  search(query: string, pageIndex: number) {
    return this.http.get<TvMazeSearchResult[]>(environment.catalogoSearch, { params: new HttpParams().set('q', query) }).pipe(
      map(results => this.toPage(results.map(result => result.show), pageIndex))
    );
  }
  private toPage(shows: TvMazeShow[], pageIndex: number): MovieResponse {
    const start = pageIndex * this.pageSize;
    return { page: pageIndex + 1, total_pages: Math.max(1, Math.ceil(shows.length / this.pageSize)), results: shows.slice(start, start + this.pageSize).map(show => this.toMovie(show)) };
  }
  private toMovie(show: TvMazeShow): Movie { return { id: show.id, title: show.name, release_date: show.premiered ?? '', vote_average: show.rating.average ?? 0, poster_path: show.image?.medium ?? null }; }
}

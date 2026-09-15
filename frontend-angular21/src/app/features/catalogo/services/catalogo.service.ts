import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Movie, MovieResponse } from '../models/movie.model';
import { environment } from '../../../enviroments/enviroment';

interface TvMazeShow {
  id: number;
  name: string;
  premiered: string | null;
  rating: { average: number | null };
  image: { medium: string } | null;
}

interface TvMazeSearchResult {
  show: TvMazeShow;
}

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);
  private readonly pageSize = 20;
  // TVMaze entrega un bloque de series que paginamos localmente.
  private readonly shows$ = this.http.get<TvMazeShow[]>(environment.catalogoFeatures, {
    params: new HttpParams().set('page', 0)
  }).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  popular(pageIndex: number): Observable<MovieResponse> {
    return this.shows$.pipe(map(shows => this.toPage(shows, pageIndex)));
  }

  search(query: string, pageIndex: number): Observable<MovieResponse> {
    return this.http.get<TvMazeSearchResult[]>(environment.catalogoSearch, {
      params: new HttpParams().set('q', query)
    }).pipe(map(results => this.toPage(results.map(result => result.show), pageIndex)));
  }

  private toPage(shows: TvMazeShow[], pageIndex: number): MovieResponse {
    const start = pageIndex * this.pageSize;
    return {
      page: pageIndex + 1,
      total_pages: Math.ceil(shows.length / this.pageSize),
      total_results: shows.length,
      results: shows.slice(start, start + this.pageSize).map(show => this.toMovie(show))
    };
  }

  private toMovie(show: TvMazeShow): Movie {
    return {
      id: show.id,
      title: show.name,
      release_date: show.premiered ?? '',
      vote_average: show.rating.average ?? 0,
      poster_path: show.image?.medium ?? null
    };
  }
}

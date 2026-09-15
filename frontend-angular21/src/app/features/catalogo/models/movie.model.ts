export interface Movie { id: number; title: string; release_date: string; vote_average: number; poster_path: string | null; }
export interface MovieResponse { page: number; total_pages: number; results: Movie[]; }

import { Routes } from '@angular/router';
export const CATALOGO_ROUTES: Routes = [
  { path: '', loadComponent: () =>
    import('./components/catalogo-list/catalogo-list.component').then(m => m.CatalogoListComponent) }];

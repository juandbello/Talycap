import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'catalogo', loadChildren: () => import('./features/catalogo/catalogo.routes').then(m => m.CATALOGO_ROUTES) },
  { path: '', pathMatch: 'full', redirectTo: 'catalogo' },
  { path: '**', redirectTo: 'catalogo' }
];

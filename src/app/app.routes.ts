import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/user-list/user-list.component').then((m) => m.UserListComponent),
  },
  {
    path: 'users/:userId/edit',
    loadComponent: () =>
      import('./features/user-edit/user-edit.component').then((m) => m.UserEditComponent),
  },
  { path: '**', redirectTo: 'users' },
];

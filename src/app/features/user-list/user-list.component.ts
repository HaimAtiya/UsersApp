import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { User } from '../../models/user.model';
import { UserActions } from '../../store/user.actions';
import {
  selectAllUsers,
  selectError,
  selectLoading,
} from '../../store/user.selectors';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  users$ = this.store.select(selectAllUsers);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  displayedColumns = ['id', 'email', 'username', 'age', 'actions'];

  ngOnInit(): void {
    this.users$.pipe(take(1)).subscribe((users) => {
      if (users.length === 0) {
        this.store.dispatch(UserActions.loadUsers());
      }
    });
  }

  onDelete(user: User): void {
    if (confirm(`Delete user "${user.username}"?`)) {
      // eslint-disable-next-line no-console
      console.log('deleted', user);
      this.store.dispatch(UserActions.deleteUser({ id: user.id }));
    }
  }

  onEdit(user: User): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }
}

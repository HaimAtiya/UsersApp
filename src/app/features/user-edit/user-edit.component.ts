import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { User } from '../../models/user.model';
import { UserActions } from '../../store/user.actions';
import { selectUserById } from '../../store/user.selectors';

const notAdminValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null =>
  control.value === 'admin' ? { adminForbidden: true } : null;

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(Store);

  @Input({transform: numberAttribute}) userId!: number;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-z0-9_]+$/),
        notAdminValidator,
      ],
    ],
    age: [
      null as number | null,
      [Validators.required, Validators.min(18), Validators.max(100)],
    ],
  });

  ngOnInit(): void {
    this.store
      .select(selectUserById(this.userId))
      .pipe(take(1))
      .subscribe((user) => {
        if (user) {
          this.form.patchValue({
            email: user.email,
            username: user.username,
            age: user.age,
          });
        } else {
          this.store.dispatch(UserActions.loadUsers());
          this.store
            .select(selectUserById(this.userId))
            .pipe(take(1))
            .subscribe((u) => {
              if (u) {
                this.form.patchValue({
                  email: u.email,
                  username: u.username,
                  age: u.age,
                });
              }
            });
        }
      });
  }

  get email() { return this.form.controls.email; }
  get username() { return this.form.controls.username; }
  get age() { return this.form.controls.age; }

  onSubmit(): void {
    if (this.form.invalid || this.form.pristine) return;
    const value = this.form.getRawValue();
    const updated: User = {
      id: this.userId,
      email: value.email!,
      username: value.username!,
      age: value.age!,
    };

    console.log('saved', updated);
    this.store.dispatch(UserActions.updateUser({ user: updated }));
    this.router.navigate(['/users']);
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}

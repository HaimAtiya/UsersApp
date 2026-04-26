import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';

const MOCK_USERS: User[] = [
  { id: 1, email: 'user1@example.com', username: 'john_doe', age: 25 },
  { id: 2, email: 'user2@example.com', username: 'jane_smith', age: 30 },
  { id: 3, email: 'admin@example.com', username: 'admin_user', age: 35 },
  { id: 4, email: 'test@test.com', username: 'test_user', age: 22 },
];

@Injectable({ providedIn: 'root' })
export class UserService {
  getUsers(): Observable<User[]> {
    return of(MOCK_USERS).pipe(delay(500));
  }
}

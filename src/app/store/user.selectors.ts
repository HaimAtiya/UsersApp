import { createFeatureSelector, createSelector } from '@ngrx/store';
import { USER_FEATURE_KEY, UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>(USER_FEATURE_KEY);

export const selectAllUsers = createSelector(selectUserState, (s) => s.users);
export const selectLoading = createSelector(selectUserState, (s) => s.loading);
export const selectError = createSelector(selectUserState, (s) => s.error);

export const selectUserById = (id: number) =>
  createSelector(selectAllUsers, (users) => users.find((u) => u.id === id));

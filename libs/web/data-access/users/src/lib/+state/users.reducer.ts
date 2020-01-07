import {
  createFeatureSelector,
  createSelector,
  createReducer,
  on,
  Action
} from '@ngrx/store';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { IUser } from '@uqt/interfaces';
import * as UserActions from './users.actions';

export const usersEntityStateKey = 'usersState';

export interface UsersEntityState extends EntityState<IUser> {
  selectedUserId: string | null;
  authUserId: string | number | null;
}

export const adapter: EntityAdapter<IUser> = createEntityAdapter<IUser>();

const initialSate: UsersEntityState = adapter.getInitialState({
  selectedUserId: null,
  authUserId: null
});

export const usersReducer = createReducer(
  initialSate,
  on(UserActions.selectUser, (state, { id }) => {
    return { ...state, selectedUserId: id };
  }),
  on(UserActions.clearSelected, state => {
    return { ...state, selectedUserId: null };
  }),
  on(UserActions.selectAuthUser, (state, { id }) => {
    return { ...state, authUserId: id };
  }),
  on(UserActions.clearAuthUser, state => {
    return { ...state, authUserId: null };
  }),
  on(UserActions.loadUsersSuccess, (state, { users }) => {
    return adapter.addAll(users, state);
  }),
  on(UserActions.loadUserSuccess, (state, { user }) => {
    return adapter.addOne(user, state);
  }),
  on(UserActions.createUserSuccess, (state, { user }) => {
    return adapter.addOne(user, state);
  }),
  on(UserActions.updateUserSuccess, (state, { user }) => {
    return adapter.updateOne(user, state);
  }),
  on(UserActions.deleteUserSuccess, (state, { id }) => {
    return adapter.removeOne(id, state);
  })
);

export function reducer(state: UsersEntityState | undefined, action: Action) {
  return usersReducer(state, action);
}

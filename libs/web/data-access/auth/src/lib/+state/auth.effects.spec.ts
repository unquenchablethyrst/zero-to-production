import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { GraphQLError } from 'graphql';
import { cold, hot, Scheduler } from 'jest-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import { createSpyObj } from '@app-testing/frontend/helpers';
import { AuthEffects } from './auth.effects';
import { AuthService } from '../services/auth.service';
import * as AuthActions from './auth.actions';
import { ILoginCredentials, IRegistrationDetails } from '../auth.interface';
import { AuthenticationRoles, IUser } from '@uqt/interfaces';

describe('AuthEffects', () => {
  let effects: AuthEffects;
  let authService: AuthService;
  let actions$: Observable<any>;
  const authSpy = createSpyObj('AuthService', [
    'login',
    'register',
    'setAuthorizationToken',
    'removeAuthorizationToken'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        { provide: AuthService, useValue: authSpy },
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject<AuthEffects>(AuthEffects);
    actions$ = TestBed.inject<Actions>(Actions);
    authService = TestBed.inject<AuthService>(AuthService);
  });

  describe('login$', () => {
    it('should return an LoginSuccess action with token', () => {
      const credentials: ILoginCredentials = { username: 'test', password: '' };
      const token = 'JWT.TOKEN';
      const action = AuthActions.login(credentials);
      const completion = AuthActions.loginSuccess({ token });

      actions$ = hot('-a---', { a: action });
      // Example graphql response below
      const response = cold('-a|', { a: { data: { login: { token } } } });
      const expected = cold('--b', { b: completion });
      authService.login = jest.fn(() => response);

      expect(effects.login$).toBeObservable(expected);
    });

    it('should return a new LoginFailure if the login service throws', () => {
      const credentials: ILoginCredentials = {
        username: 'someOne',
        password: ''
      };
      const action = AuthActions.login(credentials);
      const error = new GraphQLError('Invalid username or password');
      const completion = AuthActions.loginFailure({ error: error.message });

      /**
       * Note that with a GraphQL error, the http request does not fail,
       * rather it succeeds but has a errors property that is an array of GraphQL error
       * hence the response observable is not an error thrown, but a successful response
       */
      actions$ = hot('-a---', { a: action });
      // Do not throw error, success with an errors property
      const response = cold('-a|', { a: { errors: [error] } });
      const expected = cold('--b', { b: completion });
      authService.login = jest.fn(() => response);

      expect(effects.login$).toBeObservable(expected);
    });
  });

  describe('loginSuccess$', () => {
    it('should dispatch a LoginRedirect action', () => {
      const token = 'JWT.TOKEN';
      const action = AuthActions.loginSuccess({ token });
      const completion = AuthActions.loginRedirect();

      actions$ = hot('-a---', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loginSuccess$).toBeObservable(expected);
    });

    it('should invoke the AuthService.setAuthorizationToken with the access token', done => {
      const spy = jest.spyOn(authService, 'setAuthorizationToken');
      spy.mockReset();
      const token = 'JWT.TOKEN';
      const action = AuthActions.loginSuccess({ token });

      actions$ = hot('-a---', { a: action });

      effects.loginSuccess$.subscribe(someAction => {
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(token);
        done();
      });

      Scheduler.get().flush();

      spy.mockReset();
    });
  });

  describe('register$', () => {
    it('should return an RegisterSuccess action with user information', () => {
      const newUser: IRegistrationDetails = {
        username: 'test user',
        givenName: 'test',
        surname: 'user',
        email: 'test@domain.com',
        dateOfBirth: '2019-01-01',
        password: 'asF.s0f.s'
      };

      const registeredUser: IUser = {
        id: 'some-id',
        role: AuthenticationRoles.User,
        active: true,
        isValid: true,
        ...newUser
      };

      const action = AuthActions.register({ details: newUser });
      const completion = AuthActions.registerSuccess({ user: registeredUser });

      actions$ = hot('-a---', { a: action });
      // Example graphql response below
      const response = cold('-a|', {
        a: { data: { register: registeredUser } }
      });
      const expected = cold('--b', { b: completion });
      authService.register = jest.fn(() => response);

      expect(effects.register$).toBeObservable(expected);
    });

    it('should return a new RegisterFail if the registration throws', () => {
      const newUser = ({
        username: 'test user',
        givenName: 'test',
        surname: 'user',
        email: 'test@domain.com',
        dateOfBirth: '2019-01-01',
        settings: {
          darkMode: false,
          colors: {
            lightAccent: '',
            lightPrimary: '',
            darkAccent: '',
            darkPrimary: ''
          }
        }
      } as any) as IRegistrationDetails;

      const action = AuthActions.register({ details: newUser });

      const error = new GraphQLError('Password not provided');
      const completion = AuthActions.registerFailure({ error: error.message });

      actions$ = hot('-a---', { a: action });
      // Do not throw error, success with an errors property
      const response = cold('-a|', { a: { errors: [error] } });
      const expected = cold('--b', { b: completion });
      authService.register = jest.fn(() => response);

      expect(effects.register$).toBeObservable(expected);
    });
  });

  describe('registerSuccess$', () => {
    it('should dispatch a LogoutRedirect action', () => {
      const action = AuthActions.registerSuccess({ user: {} as IUser });
      const completion = AuthActions.logoutRedirect();

      actions$ = hot('-a---', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.registerSuccess$).toBeObservable(expected);
    });
  });

  describe('logout$', () => {
    it('should dispatch a LogoutRedirect action', () => {
      const action = AuthActions.logout();
      const completion = AuthActions.logoutRedirect();

      actions$ = hot('-a---', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.logout$).toBeObservable(expected);
    });

    it('should call the AuthService.removeAuthorizationToken with the returned token', done => {
      const spy = jest.spyOn(authService, 'removeAuthorizationToken');
      spy.mockReset();
      const action = AuthActions.logout();

      actions$ = hot('-a---', { a: action });

      effects.logout$.subscribe(act => {
        expect(spy).toHaveBeenCalled();
        done();
      });

      Scheduler.get().flush();

      spy.mockReset();
    });
  });
});

import { MockUserModel } from './user.mock';
import {
  Verify,
  VerifyModel,
  Refresh,
  RefreshModel,
  LoginControllerConfig,
  RegistrationWithVerificationConftrollerConfig,
  VerifyControllerConfig,
  AuthorizeControllerConfig,
  RefreshControllerConfig,
  RevokeControllerConfig,
  AuthUser,
  UserModel,
} from '../auth.interface';
import { MockVerifyModel } from './verification.mock';
import { privateKey } from './rsa-keys';
import { MockRefreshModel } from './refresh-token.mock';

export const issuer = 'some-issuer';
export const audience = 'say-hello!!!';
export const keyId = 'key-id';

export function mockRegistrationConfig(
  email: jest.Mock<any, any> = jest.fn()
): RegistrationWithVerificationConftrollerConfig<AuthUser, Verify> {
  return {
    User: (MockUserModel as unknown) as UserModel<AuthUser>,
    Verify: (MockVerifyModel as unknown) as VerifyModel<Verify>,
    verifyEmail: email,
  };
}

export function mockVerificationConfig(): VerifyControllerConfig<
  AuthUser,
  Verify
> {
  return {
    User: (MockUserModel as unknown) as UserModel<AuthUser>,
    Verify: (MockVerifyModel as unknown) as VerifyModel<Verify>,
  };
}

export function mockLoginConfig(): LoginControllerConfig<AuthUser> {
  return {
    User: (MockUserModel as unknown) as UserModel<AuthUser>,
    privateKey,
    expireTime: 100000,
    issuer,
    audience,
    keyId,
  };
}

export function mockAuthorizeConfig(): AuthorizeControllerConfig<
  AuthUser,
  Refresh
> {
  return {
    User: (MockUserModel as unknown) as UserModel<AuthUser>,
    privateKey,
    expireTime: 100000,
    issuer,
    audience,
    keyId,
    Refresh: (MockRefreshModel as unknown) as RefreshModel<Refresh>,
  };
}

export function mockRefreshTokenConfig(): RefreshControllerConfig<Refresh> {
  return {
    privateKey,
    audience,
    keyId,
    expireTime: 100000,
    issuer,
    Refresh: (MockRefreshModel as unknown) as RefreshModel<Refresh>,
  };
}

export function mockRevokeConfig(): RevokeControllerConfig<Refresh> {
  return {
    Refresh: (MockRefreshModel as unknown) as RefreshModel<Refresh>,
  };
}

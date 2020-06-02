import { createPublicKey, createHash } from 'crypto';
// @ts-ignore
import omit from 'lodash.omit';
import { IUserModel } from '@ztp/server/core-data';
import { ServerConfig } from '@ztp/data';
import {
  JWKSGuarConfig,
  GuardConfig,
  // LoginAndRegisterConfig,
  // AuthWithRefreshTokenConfig,
  ServerAuthConfig,
  IVerificationTokenModel,
  IRefreshTokenModel,
  // AuthModuleConfig,
  VerifyEmail,
  BasicRegistrationControllerConfig,
  RegistrationWithVerificationConftrollerConfig,
  RegistrationConfig,
  VerifyControllerConfig,
  RefreshControllerConfig,
  RevokeControllerConfig,
  AuthorizeControllerConfig,
  AuthModuleConfig,
  IncludeRefresh,
  ExcludeRefresh,
} from './auth.interface';

export function isPasswordAllowed(password: string): boolean {
  return (
    !!password &&
    password.length > 8 &&
    /\d/.test(password) &&
    /\D/.test(password) &&
    /[@$!%*#?&]/.test(password)
  );
}

export function userToJSON<T>(user: T): T {
  return omit(user, ['hashedPassword', 'password']);
}

export function generateAuthGuardConfig(
  config: ServerConfig,
  authConfig: ServerAuthConfig,
  User: IUserModel
): GuardConfig | JWKSGuarConfig {
  if (authConfig.accessToken.publicKey) {
    // The public key is provide, so do not need a JWKS
    return {
      User,
      issuer: authConfig.accessToken.issuer,
      audience: authConfig.accessToken.audience,
      publicKey: authConfig.accessToken.publicKey,
    };
  } else {
    return {
      User,
      production: config.production,
      authServerUrl: authConfig.authServerUrl,
      issuer: authConfig.accessToken.issuer,
      audience: authConfig.accessToken.audience,
    };
  }
}

// A no-op placeholder function for if no email verification is provided
// export const noOpEmailVerification: VerifyEmail = async (to, token) =>
//   Promise.resolve(true);

// export function generateAuthModuleConfig(
//   User: IUserModel,
//   config: ServerAuthConfig,
//   VerificationToken?: IVerificationTokenModel,
//   RefreshToken?: IRefreshTokenModel,
//   email?: VerifyEmail
// ): AuthModuleConfig {
//   const { publicKey, privateKey } = config.accessToken;
//   const pubKey = publicKey ? publicKey : createPublicPemFromPrivate(privateKey);

//   // The KeyId is used to retrieve the appropriate public key from a JWKS.
//   // There structure of the key is unspecified (https://tools.ietf.org/html/rfc7517#section-4.5)
//   // It is common practice to generate a UUID or similar as the key, however this
//   // will not work in a scenario such as a cloud functions (lambda) or in K8s
//   // where they can be any number of containers. So create a hash from public
//   // key as the keyId
//   const keyId = createHash('md5').update(pubKey).digest('hex');

//   return {
//     jwks: config.jwksRoute
//       ? {
//           publicKey: pubKey,
//           keyId,
//         }
//       : undefined,
//     login: { User, ...config.accessToken, keyId },
//     register: { User, VerificationToken, ...config.accessToken },
//     verify: { User, VerificationToken, ...config.accessToken },
//     authorize: {
//       User,
//       RefreshToken,
//       ...config.accessToken,
//       ...config.refreshToken,
//       keyId,
//     },
//     refresh: {
//       RefreshToken,
//       ...config.accessToken,
//       ...config.refreshToken,
//       keyId,
//     },
//     revoke: { RefreshToken },
//     email: email ? email : noOpEmailVerification,
//     authServerUrl: config.authServerUrl,
//   };
// }

export function generateAuthModuleConfig({
  User,
  config,
  VerificationToken,
  RefreshToken,
  emailClient,
}: {
  User: IUserModel;
  config: ServerAuthConfig;
  VerificationToken?: IVerificationTokenModel;
  RefreshToken?: IRefreshTokenModel;
  emailClient?: VerifyEmail;
}): AuthModuleConfig {
  const { publicKey, privateKey } = config.accessToken;
  const pubKey = publicKey ? publicKey : createPublicPemFromPrivate(privateKey);

  // The KeyId is used to retrieve the appropriate public key from a JWKS.
  // There structure of the key is unspecified (https://tools.ietf.org/html/rfc7517#section-4.5)
  // It is common practice to generate a UUID or similar as the key, however this
  // will not work in a scenario such as a cloud functions (lambda) or in K8s
  // where they can be any number of containers. So create a hash from public
  // key as the keyId
  const keyId = createHash('md5').update(pubKey).digest('hex');

  const jwks = config.jwksRoute
    ? {
        publicKey: pubKey,
        keyId,
      }
    : undefined;

  const login = { User, ...config.accessToken, keyId };

  let register: RegistrationConfig;
  let verify: VerifyControllerConfig | undefined;
  if (VerificationToken && emailClient) {
    register = {
      User,
      VerificationToken,
      ...config.accessToken,
      verifyEmail: emailClient,
    } as RegistrationWithVerificationConftrollerConfig;

    verify = { User, VerificationToken } as VerifyControllerConfig;
  } else {
    register = {
      User,
      ...config.accessToken,
    } as BasicRegistrationControllerConfig;
  }

  let authorize: AuthorizeControllerConfig | undefined;
  let refresh: RefreshControllerConfig | undefined;
  let revoke: RevokeControllerConfig | undefined;
  if (RefreshToken) {
    (authorize = {
      User,
      RefreshToken,
      ...config.accessToken,
      ...config.refreshToken,
      keyId,
    } as AuthorizeControllerConfig),
      (refresh = {
        RefreshToken,
        ...config.accessToken,
        ...config.refreshToken,
        keyId,
      } as RefreshControllerConfig);

    revoke = {
      RefreshToken,
    } as RevokeControllerConfig;
  }

  return {
    jwks,
    login,
    register,
    verify,
    authorize,
    refresh,
    revoke,
    authServerUrl: config.authServerUrl,
  };
}

export function createPublicPemFromPrivate(privateKey: string) {
  const publicKey = createPublicKey(privateKey);

  return publicKey.export({ format: 'pem', type: 'spki' }) as string;
}

export function createEmailMessage(authServerUrl: string) {
  return (to: string, token: string) => {
    return {
      to,
      from: 'register@zero-to-production.com',
      subject: 'Verify Your Email',
      text: `Click on the link to verify your email ${authServerUrl}/authorize/verify?token=${token}&email=${to}`,
    };
  };
}

export function isJWKS(
  config: JWKSGuarConfig | GuardConfig
): config is JWKSGuarConfig {
  return (config as GuardConfig).publicKey === undefined;
}

export function includeRefresh(
  config: IncludeRefresh | ExcludeRefresh
): config is IncludeRefresh {
  return (config as IncludeRefresh).authorize !== undefined;
}

export function includeEmailVerification(
  config:
    | BasicRegistrationControllerConfig
    | RegistrationWithVerificationConftrollerConfig
): config is RegistrationWithVerificationConftrollerConfig {
  return (
    (config as RegistrationWithVerificationConftrollerConfig)
      .VerificationToken !== undefined
  );
}

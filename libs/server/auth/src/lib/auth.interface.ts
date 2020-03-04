import mongoose from 'mongoose';
import { GraphQLFieldResolver } from 'graphql';
import { IUserModel, IUserDocument } from '@uqt/server/core-data';

export type AuthMiddleware = GraphQLFieldResolver<any, any, any>;

export type VerifyEmail = (to: string, token: string) => Promise<[any, {}]>;

export type AuthModuleConfig =
  | LoginAndRegisterConfig
  | AuthWithRefreshTokenConfig;

export interface LoginAndRegisterConfig {
  jwks?: JWKSRouteConfig;
  login: LoginControllerConfig;
  verify: VerifyControllerConfig;
  register: VerifyControllerConfig; // This is the same as verify because setting up the SendGrid email happens in the controller
  email: EmailVerificationConfig;
}

export interface AuthWithRefreshTokenConfig extends LoginAndRegisterConfig {
  authorize: AuthorizeControllerConfig;
  refresh: RefreshControllerConfig;
  revoke: RevokeControllerConfig;
}

// -------------------------------------
// For signing access and refresh tokens
// -------------------------------------

export interface AccessTokenConfig {
  privateKey: string;
  expireTime: number;
  issuer: string;
  audience: string;
  keyId: string;
}

export interface RefreshTokenConfig {
  privateKey: string;
  audience: string;
  issuer: string;
}

export interface EmailVerificationConfig {
  sendGridApiKey: string;
  authServerUrl: string;
}

export interface JWKSRouteConfig {
  publicKey: string;
  keyId: string;
}

export interface JWKSGuardConfig {
  authServerUrl: string;
  production: boolean;
}

// -------------------------------------
// Interfaces for each controller
// -------------------------------------
export interface LoginControllerConfig extends AccessTokenConfig {
  User: IUserModel;
}

export interface VerifyControllerConfig {
  User: IUserModel;
  VerificationToken: IVerificationTokenModel;
}

export interface RegistrationControllerConfig extends VerifyControllerConfig {
  verificationEmail: VerifyEmail;
}

export interface AvailableControllerConfig {
  User: IUserModel;
}

export interface AuthorizeControllerConfig
  extends LoginControllerConfig,
    RefreshTokenConfig {
  RefreshToken: IRefreshTokenModel;
}

export interface RefreshControllerConfig
  extends AccessTokenConfig,
    RefreshTokenConfig {
  RefreshToken: IRefreshTokenModel;
}

export interface RevokeControllerConfig {
  RefreshToken: IRefreshTokenModel;
}

// -------------------------------------
// Interfaces for the Auth Guards
// -------------------------------------

export interface GuardConfig
  extends VerifyTokenConfig,
    VerifyActiveUserConfig {}

export interface JWKSGuarConfig
  extends VerifyTokenJWKSConfig,
    VerifyActiveUserConfig {}

export interface VerifyTokenJWKSConfig {
  issuer: string;
  audience: string;
  authServerUrl: string;
  production: boolean;
}

export interface VerifyTokenConfig {
  issuer: string;
  audience: string;
  publicKey: string;
}

export interface VerifyActiveUserConfig {
  User: IUserModel;
}

export type TResolverAuthGuard = (
  resolver: GraphQLFieldResolver<any, any, any>
) => GraphQLFieldResolver<any, any, any>;

// -------------------------------------
// Interfaces for each Model
// -------------------------------------
export interface IRefreshToken {
  user: IUserDocument;
  token: string;
}

export interface IRefreshTokenDocument
  extends IRefreshToken,
    mongoose.Document {
  id: string;
}

export interface IRefreshTokenModel
  extends mongoose.Model<IRefreshTokenDocument> {
  findByTokenWithUser(token: string): Promise<IRefreshTokenDocument | null>;
}

export interface IVerificationToken {
  userId: string;
  token: string;
}

export interface IVerificationTokenDocument
  extends IVerificationToken,
    mongoose.Document {
  id: string;
}

export interface IVerificationTokenModel
  extends mongoose.Model<IVerificationTokenDocument> {}

// -------------------------------------
// Interfaces for the auth environment config
// -------------------------------------
export interface AuthEnvironnementConfig {
  authServerUrl: string;
  jwksRoute?: boolean;
  accessToken: {
    privateKey: string;
    publicKey?: string;
    expireTime: number;
    issuer: string;
    keyId: string;
    audience: string;
  };
  refreshToken: {
    privateKey: string;
    publicKey?: string;
    issuer: string;
    audience: string;
  };
  email: {
    authServerUrl: string;
    sendGridApiKey: string;
  };
}

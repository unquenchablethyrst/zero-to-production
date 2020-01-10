import { randomBytes } from 'crypto';
import { compare, hash } from 'bcryptjs';
import Boom from '@hapi/boom';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './token';
import {
  LoginControllerConfig,
  RegistrationControllerConfig,
  VerifyControllerConfig,
  AuthorizeControllerConfig,
  RefreshControllerConfig,
  RevokeControllerConfig
} from './auth.interface';
import { IUser } from '@uqt/interfaces';
import { isPasswordAllowed, userToJSON } from './auth-utils';

// TODO -> Refresh Token Model/Storage

export function setupRegisterController({
  User,
  VerificationToken,
  verificationEmail
}: RegistrationControllerConfig) {
  return async (user: IUser) => {
    const password: string = (user as any).password;
    if (!password) Boom.badRequest('No password provided');

    if (!isPasswordAllowed(password))
      throw Boom.badRequest('Password does not meet requirements');

    const currentUser = await User.findByUsername(user.username);
    if (currentUser !== null)
      throw Boom.badRequest('Username is not available');

    user.hashedPassword = await hash(password, 10);

    const newUser = new User({ ...user, isValid: false, active: true });
    await newUser.save();

    const verificationToken = new VerificationToken({
      userId: newUser.id,
      token: randomBytes(16).toString('hex')
    });

    await await verificationToken.save();
    await verificationEmail(user.email, verificationToken.token);

    return userToJSON(newUser.toJSON());
  };
}

/**
 *
 *
 * @export
 * @param {IUserModel} User
 * @param {IVerificationTokenModel} VerificationToken
 * @returns Verification Controller
 */
export function setupVerifyController({
  User,
  VerificationToken
}: VerifyControllerConfig) {
  return async (email: string, token: string) => {
    /**
     * Check the user exists and is not already registered
     */
    const user = await User.findOne({ email }).exec();

    if (!user) throw Boom.badRequest('Email address is not available');
    if (user.isValid) throw Boom.badRequest('User is already registered');

    /**
     * Check the provided Token is valid
     */
    const verificationToken = await VerificationToken.findOne({ token }).exec();
    if (!verificationToken) throw Boom.badRequest('Token is not valid');

    /**
     * Is the provided token and email a match
     */
    if (verificationToken.userId.toString() !== user.id.toString())
      throw Boom.badRequest('Token does not match email address');

    user.set({ isValid: true });
    /**
     * Update the user status to valid, and remove the token from the db.
     */
    await Promise.all([user.save(), verificationToken.remove()]);

    return { message: `User with ${user.email} has been verified` };
  };
}

/**
 *  A function that handles logging a user in
 *
 * @export
 * @param {{
 *   userModel: IUserModel;
 *   secret: string;
 *   expireTime: number;
 * }} {
 *   userModel,
 *   secret,
 *   expireTime
 * }
 */
export function setupLoginController(config: LoginControllerConfig) {
  const { User } = config;
  const accessToken = signAccessToken(config);

  return async (username: string, password: string) => {
    const user = await User.findByUsername(username);

    if (!user || !user.active) throw Boom.unauthorized(null, 'Bearer');

    const valid = await compare(password, user.hashedPassword as string);

    if (!valid) throw Boom.unauthorized(null, 'Bearer');

    const token = accessToken(user);

    return {
      token,
      expiresIn: config.accessTokenExpireTime
    };
  };
}

export function setupAuthorizeController(config: AuthorizeControllerConfig) {
  const { User, RefreshToken } = config;
  const createAccessToken = signAccessToken(config);
  const createRefreshToken = signRefreshToken(config);

  return async (username: string, password: string) => {
    const user = await User.findByUsername(username);

    if (!user || user.active === false) throw Boom.unauthorized(null, 'Bearer');

    const valid = await compare(password, user.hashedPassword as string);

    if (!valid) throw Boom.unauthorized(null, 'Bearer');

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await RefreshToken.create({
      user: user.id,
      token: refreshToken
    });

    return {
      token: accessToken,
      expiresIn: config.accessTokenExpireTime,
      refreshToken: refreshToken
    };
  };
}

// a controller that receives a refresh token and returns an access token.
export function setupRefreshAccessTokenController(
  config: RefreshControllerConfig
) {
  const { RefreshToken } = config;
  const verify = verifyRefreshToken(config);
  const createAccessToken = signAccessToken(config);

  return async (username: string, refreshTokenProvided: string) => {
    // Verify the refresh token. Don't care about decoding it (as we retrieve form DB as well),
    // Just catch and throw an unauthorized error
    try {
      await verify(refreshTokenProvided);
    } catch (err) {
      throw Boom.unauthorized(null, 'Bearer');
    }

    const savedToken = await RefreshToken.findByTokenWithUser(
      refreshTokenProvided
    );
    // No token found
    if (savedToken === null) throw Boom.unauthorized(null, 'Bearer');

    // No user found or matched with given parameters
    if (savedToken.user === null || savedToken.user.username !== username)
      throw Boom.unauthorized(null, 'Bearer');

    // revoke refreshToken if user is inactive
    if (savedToken.user.active === false) {
      await savedToken.remove();
      throw Boom.unauthorized(null, 'Bearer');
    }
    const accessToken = createAccessToken(savedToken.user);

    return {
      token: accessToken
    };
  };
}

// a controller to revoke a refresh token
export function setupRevokeRefreshTokenController({
  RefreshToken
}: RevokeControllerConfig) {
  return async (token: string) => {
    const refreshToken = await RefreshToken.findOne({ token }).exec();

    if (refreshToken === null) throw Boom.badRequest();

    await refreshToken.remove();

    return { success: true };
  };
}

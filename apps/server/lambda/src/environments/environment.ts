/* istanbul ignore file */

import { ServerConfig } from '@ztp/data';
import { envToNumber, getEnvVariableOrWarn } from '@ztp/server/utils';
import { AuthEnvironnementConfig } from '@ztp/server/auth';

const audience = process.env.AUDIENCE || `http://localhost:${process.env.PORT}`;
const authServerUrl =
  process.env.AUTH_SERVER_URL || `http://localhost:${process.env.PORT}`;

// TODO -> They keyId should be some sort of hash or something
const keyId = 'some-random-key-id';

export const config: ServerConfig = {
  production: false,
  dbConnectionString: getEnvVariableOrWarn('DB_CONNECTION_STRING'),
  databaseOptions: {
    dbName: getEnvVariableOrWarn('MONGO_DEV_DB'),
    autoIndex: true,
    loggerLevel: 'warn',
    useNewUrlParser: true,
    promiseLibrary: Promise,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0, // and MongoDB driver buffering
  },
};

export const authConfig: AuthEnvironnementConfig = {
  jwksRoute: false,
  authServerUrl,
  accessToken: {
    privateKey: getEnvVariableOrWarn('ACCESS_TOKEN_PRIVATE_KEY'),
    publicKey: getEnvVariableOrWarn('ACCESS_TOKEN_PUBLIC_KEY'),
    expireTime: envToNumber(process.env.ACCESS_TOKEN_EXPIRE_TIME, 86400),
    issuer: getEnvVariableOrWarn('ISSUER'),
    audience,
    keyId,
  },
  refreshToken: {
    privateKey: getEnvVariableOrWarn('REFRESH_TOKEN_PRIVATE_KEY'),
    publicKey: getEnvVariableOrWarn('REFRESH_TOKEN_PUBLIC_KEY'),
    issuer: getEnvVariableOrWarn('ISSUER'),
    audience,
  },
  email: {
    authServerUrl,
    sendGridApiKey: getEnvVariableOrWarn('SENDGRID_API_KEY'),
  },
};

process.env.PORT = '9999';

import Koa from 'koa';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { runQuery, setupTestDB, signTestAccessToken } from '@ztp/tests/server';
import { IUserDocument } from '@ztp/server/core-data';
import { schema } from '../../graphql';
import { authConfig } from '../../../environments';
import { IUser } from '@ztp/data';
import ApiServer from '../../server';
import { Server } from 'http';
import { User } from './user.model';
import { createHash } from 'crypto';

const keyId = createHash('md5')
  .update(authConfig.accessToken.publicKey as string)
  .digest('hex');

// Need to import and run the server because
// the server is also our "auth server"
// and the Auth guard needs to be able to retrieve the JWKS
const server = new ApiServer(new Koa());

const user: IUser = {
  username: 'test user',
  givenName: 'test',
  surname: 'user',
  email: 'test@domain.com',
  dateOfBirth: '2019-01-01',
  hashedPassword: 'some-password-hash',
} as IUser;

const updatedUser = { username: 'updated user' };

// ----------------------------------
// GraphQL API tests
// ----------------------------------
describe(`GraphQL / User`, () => {
  // let connection: mongoose.Connection;
  let mongoServer: MongoMemoryServer;
  let dbUri: string;
  let createdUser: IUserDocument;
  let jwt: string;
  let testServer: Server;

  beforeAll(async () => {
    ({ dbUri, mongoServer } = await setupTestDB());
    testServer = await server.initializeServer(dbUri);

    createdUser = await User.create(user);

    [createdUser.id, createdUser._id] = [createdUser._id, createdUser.id];

    const config = { ...authConfig.accessToken, keyId };
    jwt = signTestAccessToken(config)(createdUser);
  });

  afterAll(async () => {
    testServer.close();
    await mongoServer.stop();
  });

  describe(`allUsers`, () => {
    it(`should return all Users`, async () => {
      const queryName = `allUsers`;
      // language=GraphQL
      const result = await runQuery(schema)(
        `
        {
          ${queryName} {
            id
            username
          }
        }`,
        {},
        jwt
      );

      expect(result.errors).not.toBeDefined();
      expect((result.data as any)[queryName]).toBeArray();
    });
  });

  describe(`User(id: ID!)`, () => {
    it(`should return a User by id`, async () => {
      const queryName = `User`;

      const result = await runQuery(schema)(
        `
      {
        ${queryName}(id: "${createdUser.id}") {
          id
        }
      }`,
        {},
        jwt
      );

      expect(result.errors).not.toBeDefined();
      expect((result.data as any)[queryName]).toBeObject();
      expect((result.data as any)[queryName].id).toEqual(
        createdUser.id.toString()
      );
    });
  });

  describe(`updateUser($input: UpdatedUserInput!)`, () => {
    it(`should update an User`, async () => {
      const queryName = `updateUser`;

      (updatedUser as any).id = createdUser.id;

      const result = await runQuery(schema)(
        `
          mutation UpdateUser($input: UpdatedUserInput!) {
            ${queryName}(input: $input) {
              id
            }
          }
        `,
        { input: updatedUser },
        jwt
      );

      expect(result.errors).not.toBeDefined();
      expect((result.data as any)[queryName]).toBeObject();
      expect((result.data as any)[queryName].id).toEqual(
        createdUser.id.toString()
      );
    });
  });

  describe(`removeUser($id: ID!)`, () => {
    it(`should delete a User by id`, async () => {
      const queryName = `removeUser`;
      const result = await runQuery(schema)(
        `
          mutation RemoveUser($id: ID!) {
            ${queryName}(id: $id) {
              id
            }
          }`,
        { id: createdUser.id },
        jwt
      );

      expect(result.errors).not.toBeDefined();
      expect((result.data as any)[queryName]).toBeObject();
    });
  });
});

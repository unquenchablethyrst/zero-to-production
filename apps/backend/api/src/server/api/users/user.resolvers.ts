import { IUserDocument } from '@uqt/server/core-data';
import { generateResolvers } from '@uqt/server/utils';
import { User } from '@uqt/server/core-data';
import { verifyTokenGraphQL } from '../../auth/auth.guards';

const resolvers = generateResolvers<IUserDocument>(User);

export const userResolvers = {
  Query: {
    User: verifyTokenGraphQL(resolvers.getOne),
    allUsers: verifyTokenGraphQL(resolvers.getAll)
  },
  Mutation: {
    updateUser: verifyTokenGraphQL(resolvers.updateOne),
    removeUser: verifyTokenGraphQL(resolvers.removeOne)
  }
};

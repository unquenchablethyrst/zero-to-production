const serverUrl = 'https://api.zero-to-production.dev';

export const environment = {
  production: false,
  authServer: serverUrl,
  apiBaseUrl: `${serverUrl}/api`,
  graphQLUrl: `${serverUrl}/graphql`,
  typePolicies: {
    Query: {
      fields: {
        allTodoNotes: {
          merge(existing = [], incoming: any[]) {
            return incoming;
          },
        },
      },
    },
  },
};

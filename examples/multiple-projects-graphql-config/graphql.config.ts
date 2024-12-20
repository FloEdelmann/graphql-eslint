import type { GraphQLTagPluckOptions, IGraphQLConfig } from '@graphql-eslint/eslint-plugin';

const config: IGraphQLConfig = {
  projects: {
    firstProject: {
      schema: 'schema.first-project.graphql',
      documents: 'query.first-project.js',
    },
    secondProject: {
      schema: 'schema.second-project.graphql',
      documents: 'query.second-project.js',
      extensions: {
        // in case you want to use different names for magic comment and module identifier
        pluckConfig: {
          modules: [{ name: 'custom-graphql-tag', identifier: 'custom' }],
          globalGqlIdentifierName: 'custom',
          gqlMagicComment: 'MyGraphQL',
        } satisfies GraphQLTagPluckOptions,
      },
    },
  },
};

export default config;

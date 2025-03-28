import { ruleTester } from '../../../__tests__/test-utils.js';
import { rule, RuleOptions } from './index.js';

ruleTester.run<RuleOptions>('naming-convention', rule, {
  valid: [
    {
      code: /* GraphQL */ `
        query GetUser($userId: ID!) {
          user(id: $userId) {
            id
            name
            isViewerFriend
            profilePicture(size: 50) {
              ...PictureFragment
            }
          }
        }

        fragment PictureFragment on Picture {
          uri
          width
          height
        }
      `,
      options: [
        {
          types: 'PascalCase',
          VariableDefinition: 'camelCase',
          EnumValueDefinition: 'UPPER_CASE',
          OperationDefinition: 'PascalCase',
          FragmentDefinition: 'PascalCase',
        },
      ],
    },
    {
      code: 'type B { test: String }',
      options: [{ types: 'PascalCase' }],
    },
    {
      code: 'type my_test_6_t { test: String }',
      options: [{ types: 'snake_case' }],
    },
    {
      code: 'type MY_TEST_6_T { test: String }',
      options: [{ types: 'UPPER_CASE' }],
    },
    {
      code: 'type B { test: String }',
      options: [{ allowLeadingUnderscore: false, allowTrailingUnderscore: false }],
    },
    {
      code: 'type __B { __test__: String }',
      options: [
        {
          allowLeadingUnderscore: true,
          allowTrailingUnderscore: true,
          types: 'PascalCase',
          FieldDefinition: 'camelCase',
        },
      ],
    },
    {
      code: 'scalar BSONDecimal',
      options: [{ types: 'PascalCase' }],
    },
    {
      code: 'interface B { test: String }',
      options: [{ types: 'PascalCase' }],
    },
    {
      code: 'enum B { TEST }',
      options: [{ types: 'PascalCase', EnumValueDefinition: 'UPPER_CASE' }],
    },
    {
      code: 'input Test { item: String }',
      options: [{ types: 'PascalCase', InputValueDefinition: 'camelCase' }],
    },
    'input test { item: String } enum B { Test } interface A { i: String } fragment PictureFragment on Picture { uri } scalar Hello',
    {
      code: 'type TypeOne { aField: String } enum Z { VALUE_ONE VALUE_TWO }',
      options: [
        {
          types: { style: 'PascalCase' },
          FieldDefinition: { style: 'camelCase', suffix: 'Field' },
          EnumValueDefinition: { style: 'UPPER_CASE', suffix: '' },
        },
      ],
    },
    {
      code: 'type One { fieldA: String } enum Z { ENUM_VALUE_ONE ENUM_VALUE_TWO }',
      options: [
        {
          types: { style: 'PascalCase' },
          FieldDefinition: { style: 'camelCase', prefix: 'field' },
          EnumValueDefinition: { style: 'UPPER_CASE', prefix: 'ENUM_VALUE_' },
        },
      ],
    },
    {
      code: 'type One { fieldA: String } type Query { QUERY_A(id: ID!): String }',
      options: [
        {
          'FieldDefinition[parent.name.value=Query]': { style: 'UPPER_CASE', prefix: 'QUERY' },
          'FieldDefinition[parent.name.value!=Query]': { style: 'camelCase', prefix: 'field' },
        },
      ],
    },
    {
      code: 'query { foo }',
      options: [{ OperationDefinition: { style: 'PascalCase' } }],
    },
    {
      code: '{ test { __typename ok_ } }',
    },
    {
      name: 'should ignore fields',
      code: /* GraphQL */ `
        type Test {
          EU: ID
          EUIntlFlag: ID
          IE: ID
          IEIntlFlag: ID
          GB: ID
          UKFlag: ID
          UKService_Badge: ID
          CCBleaching: ID
          CCDryCleaning: ID
          CCIroning: ID
          UPC: ID
          CMWA: ID
          EAN13: ID
        }
      `,
      options: [
        {
          FieldDefinition: {
            style: 'camelCase',
            ignorePattern: '^(EU|IE|GB|UK|CC|UPC|CMWA|EAN13)',
          },
        },
      ],
    },
    {
      name: 'should allow single letter for camelCase',
      code: 'type t',
      options: [{ ObjectTypeDefinition: 'camelCase' }],
    },
    {
      name: 'should allow single letter for PascalCase',
      code: 'type T',
      options: [{ ObjectTypeDefinition: 'PascalCase' }],
    },
    {
      name: 'should allow single letter for snake_case',
      code: 'type t',
      options: [{ ObjectTypeDefinition: 'snake_case' }],
    },
    {
      name: 'should allow single letter for UPPER_CASE',
      code: 'type T',
      options: [{ ObjectTypeDefinition: 'UPPER_CASE' }],
    },
    {
      code: /* GraphQL */ `
        scalar Secret

        interface Snake {
          value: String!
        }

        type Test {
          isEnabled: Boolean!
          SUPER_SECRET_secret: Secret!
          hiss_snake: Snake
        }
      `,
      options: [
        {
          'FieldDefinition[gqlType.gqlType.name.value=Boolean]': {
            style: 'camelCase',
            requiredPrefixes: ['is', 'has'],
          },
          'FieldDefinition[gqlType.gqlType.name.value=Secret]': {
            requiredPrefixes: ['SUPER_SECRET_'],
          },
          'FieldDefinition[gqlType.name.value=Snake]': {
            style: 'snake_case',
            requiredPrefixes: ['hiss_'],
          },
        },
      ],
    },
    {
      code: /* GraphQL */ `
        scalar IpAddress

        type Test {
          specialFeatureEnabled: Boolean!
          userIpAddress: IpAddress!
        }
      `,
      options: [
        {
          'FieldDefinition[gqlType.gqlType.name.value=Boolean]': {
            style: 'camelCase',
            requiredSuffixes: ['Enabled', 'Disabled'],
          },
          'FieldDefinition[gqlType.gqlType.name.value=IpAddress]': {
            requiredSuffixes: ['IpAddress'],
          },
        },
      ],
    },
    {
      name: 'should not fail when aliasing underscore fields',
      code: /* GraphQL */ `
        {
          test {
            bar: __foo
            foo: bar__
          }
        }
      `,
    },
    {
      name: '`allowLeadingUnderscore` and `allowTrailingUnderscore` should not conflict with `ignorePattern`',
      code: /* GraphQL */ `
        type SomeType {
          _someField_: Boolean!
        }
      `,
      options: [
        {
          'FieldDefinition[parent.name.value=SomeType]': {
            ignorePattern: '.*someField.*',
          },
        },
      ],
    },
    {
      name: 'requiredPattern with case style in prefix',
      options: [
        {
          FragmentDefinition: {
            style: 'PascalCase',
            requiredPattern: /^(?<camelCase>.+?)_/,
          },
        },
      ],
      code: /* GraphQL */ `
        fragment myUser_UserProfileFields on User {
          id
        }
      `,
      parserOptions: {
        graphQLConfig: {
          schema: 'type User',
        },
      },
    },
    {
      name: 'requiredPattern with case style in suffix',
      options: [
        {
          FragmentDefinition: {
            style: 'PascalCase',
            requiredPattern: /_(?<snake_case>.+?)$/,
          },
        },
      ],
      code: /* GraphQL */ `
        fragment UserProfileFields_my_user on User {
          id
        }
      `,
      parserOptions: {
        graphQLConfig: {
          schema: 'type User',
        },
      },
    },
  ],
  invalid: [
    {
      code: 'type b { test: String }',
      options: [{ types: 'PascalCase', FieldDefinition: 'PascalCase' }],
      errors: [
        { message: 'Type "b" should be in PascalCase format' },
        { message: 'Field "test" should be in PascalCase format' },
      ],
    },
    {
      code: 'type __b { test__: String }',
      options: [{ allowLeadingUnderscore: false, allowTrailingUnderscore: false }],
      errors: [
        { message: 'Leading underscores are not allowed' },
        { message: 'Trailing underscores are not allowed' },
      ],
    },
    {
      code: 'scalar BSONDecimal',
      options: [{ ScalarTypeDefinition: 'snake_case' }],
      errors: [{ message: 'Scalar "BSONDecimal" should be in snake_case format' }],
    },
    {
      name: 'large graphql file',
      code: ruleTester.fromMockFile('large.graphql'),
      options: [
        {
          allowLeadingUnderscore: true,
          types: 'PascalCase',
          InputValueDefinition: 'camelCase',
          EnumValueDefinition: 'UPPER_CASE',
          FragmentDefinition: 'PascalCase',
        },
      ],
      errors: [
        { message: 'Input "_idOperatorsFilterFindManyUserInput" should be in PascalCase format' },
        { message: 'Input "_idOperatorsFilterFindOneUserInput" should be in PascalCase format' },
        { message: 'Input "_idOperatorsFilterRemoveManyUserInput" should be in PascalCase format' },
        { message: 'Input "_idOperatorsFilterRemoveOneUserInput" should be in PascalCase format' },
        { message: 'Input "_idOperatorsFilterUpdateManyUserInput" should be in PascalCase format' },
        { message: 'Input "_idOperatorsFilterUpdateOneUserInput" should be in PascalCase format' },
        { message: 'Input "_idOperatorsFilterUserInput" should be in PascalCase format' },
        { message: 'Enum value "male" should be in UPPER_CASE format' },
        { message: 'Enum value "female" should be in UPPER_CASE format' },
        { message: 'Enum value "ladyboy" should be in UPPER_CASE format' },
        { message: 'Enum value "basic" should be in UPPER_CASE format' },
        { message: 'Enum value "fluent" should be in UPPER_CASE format' },
        { message: 'Enum value "native" should be in UPPER_CASE format' },
        { message: 'Input value "OR" should be in camelCase format' },
        { message: 'Input value "AND" should be in camelCase format' },
        { message: 'Input value "OR" should be in camelCase format' },
        { message: 'Input value "AND" should be in camelCase format' },
        { message: 'Input value "OR" should be in camelCase format' },
        { message: 'Input value "AND" should be in camelCase format' },
        { message: 'Input value "OR" should be in camelCase format' },
        { message: 'Input value "AND" should be in camelCase format' },
        { message: 'Input value "OR" should be in camelCase format' },
        { message: 'Input value "AND" should be in camelCase format' },
        { message: 'Input value "OR" should be in camelCase format' },
        { message: 'Input value "AND" should be in camelCase format' },
        { message: 'Input value "OR" should be in camelCase format' },
        { message: 'Input value "AND" should be in camelCase format' },
      ],
    },
    {
      code: 'enum B { test }',
      options: [
        {
          EnumTypeDefinition: 'camelCase',
          EnumValueDefinition: 'UPPER_CASE',
        },
      ],
      errors: [
        { message: 'Enum "B" should be in camelCase format' },
        { message: 'Enum value "test" should be in UPPER_CASE format' },
      ],
    },
    {
      code: 'input test { _Value: String }',
      options: [{ types: 'PascalCase', InputValueDefinition: 'snake_case' }],
      errors: [
        { message: 'Input "test" should be in PascalCase format' },
        { message: 'Input value "_Value" should be in snake_case format' },
        { message: 'Leading underscores are not allowed' },
      ],
    },
    {
      code: 'type TypeOne { aField: String } enum Z { VALUE_ONE VALUE_TWO }',
      options: [
        {
          ObjectTypeDefinition: { style: 'camelCase' },
          FieldDefinition: { style: 'camelCase', suffix: 'AAA' },
          EnumValueDefinition: { style: 'camelCase', suffix: 'ENUM' },
        },
      ],
      errors: [
        { message: 'Type "TypeOne" should be in camelCase format' },
        { message: 'Field "aField" should have "AAA" suffix' },
        { message: 'Enum value "VALUE_ONE" should have "ENUM" suffix' },
        { message: 'Enum value "VALUE_TWO" should have "ENUM" suffix' },
      ],
    },
    {
      code: 'type One { aField: String } enum Z { A_ENUM_VALUE_ONE VALUE_TWO }',
      options: [
        {
          ObjectTypeDefinition: { style: 'PascalCase' },
          FieldDefinition: { style: 'camelCase', prefix: 'Field' },
          EnumValueDefinition: { style: 'UPPER_CASE', prefix: 'ENUM' },
        },
      ],
      errors: [
        { message: 'Field "aField" should have "Field" prefix' },
        { message: 'Enum value "A_ENUM_VALUE_ONE" should have "ENUM" prefix' },
        { message: 'Enum value "VALUE_TWO" should have "ENUM" prefix' },
      ],
    },
    {
      code: 'type One { getFoo: String, queryBar: String } type Query { getA(id: ID!): String, queryB: String } extend type Query { getC: String }',
      options: [
        {
          ObjectTypeDefinition: { style: 'PascalCase', forbiddenPrefixes: ['On'] },
          FieldDefinition: {
            style: 'camelCase',
            forbiddenPrefixes: ['foo', 'bar'],
            forbiddenSuffixes: ['Foo'],
          },
          'FieldDefinition[parent.name.value=Query]': {
            style: 'camelCase',
            forbiddenPrefixes: ['get', 'query'],
          },
        },
      ],
      errors: [
        { message: 'Type "One" should not have "On" prefix' },
        { message: 'Field "getFoo" should not have "Foo" suffix' },
        { message: 'Field "getA" should not have "get" prefix' },
        { message: 'Field "queryB" should not have "query" prefix' },
        { message: 'Field "getC" should not have "get" prefix' },
      ],
    },
    {
      code: 'query Foo { foo } query getBar { bar }',
      options: [{ OperationDefinition: { style: 'camelCase', forbiddenPrefixes: ['get'] } }],
      errors: [
        { message: 'Query "Foo" should be in camelCase format' },
        { message: 'Query "getBar" should not have "get" prefix' },
      ],
    },
    {
      name: 'schema-recommended config',
      code: /* GraphQL */ `
        type Query {
          fieldQuery: ID
          queryField: ID
          getField: ID
        }

        type Mutation {
          fieldMutation: ID
          mutationField: ID
        }

        type Subscription {
          fieldSubscription: ID
          subscriptionField: ID
        }

        enum TestEnum
        extend enum EnumTest {
          A
        }

        interface TestInterface
        extend interface InterfaceTest {
          id: ID
        }

        union TestUnion
        extend union UnionTest = TestInterface

        type TestType
        extend type TypeTest {
          id: ID
        }
      `,
      options: (rule.meta.docs!.configOptions as any).schema,
      errors: 15,
    },
    {
      name: 'operations-recommended config',
      code: `
        query TestQuery { test }
        query QueryTest { test }
        query GetQuery { test }
        query Test { test(CONTROLLED_BY_SCHEMA: 0) }

        mutation TestMutation { test }
        mutation MutationTest { test }

        subscription TestSubscription { test }
        subscription SubscriptionTest { test }

        fragment TestFragment on Test { id }
        fragment FragmentTest on Test { id }
      `,
      options: (rule.meta.docs!.configOptions as any).operations,
      errors: [
        {
          message:
            'Query "TestQuery" should not contain the forbidden pattern "/(query|mutation|subscription)$/i"',
        },
        {
          message:
            'Query "QueryTest" should not contain the forbidden pattern "/^(query|mutation|subscription|get)/i"',
        },
        {
          message:
            'Query "GetQuery" should not contain the forbidden pattern "/^(query|mutation|subscription|get)/i"',
        },
        {
          message:
            'Mutation "TestMutation" should not contain the forbidden pattern "/(query|mutation|subscription)$/i"',
        },
        {
          message:
            'Mutation "MutationTest" should not contain the forbidden pattern "/^(query|mutation|subscription|get)/i"',
        },
        {
          message:
            'Subscription "TestSubscription" should not contain the forbidden pattern "/(query|mutation|subscription)$/i"',
        },
        {
          message:
            'Subscription "SubscriptionTest" should not contain the forbidden pattern "/^(query|mutation|subscription|get)/i"',
        },
        {
          message:
            'Fragment "TestFragment" should not contain the forbidden pattern "/(^fragment)|(fragment$)/i"',
        },
        {
          message:
            'Fragment "FragmentTest" should not contain the forbidden pattern "/(^fragment)|(fragment$)/i"',
        },
      ],
    },
    {
      name: 'should ignore selections fields but check alias renaming',
      code: /* GraphQL */ `
        {
          test {
            _badAlias: foo
            badAlias_: bar
            _ok
            ok_
          }
        }
      `,
      errors: [
        { message: 'Leading underscores are not allowed' },
        { message: 'Trailing underscores are not allowed' },
      ],
    },
    {
      name: 'should error when selected type names do not match require prefixes',
      code: /* GraphQL */ `
        scalar Secret

        interface Snake {
          value: String!
        }

        type Test {
          enabled: Boolean!
          secret: Secret!
          snake: Snake
        }
      `,
      options: [
        {
          'FieldDefinition[gqlType.gqlType.name.value=Boolean]': {
            style: 'camelCase',
            requiredPrefixes: ['is', 'has'],
          },
          'FieldDefinition[gqlType.gqlType.name.value=Secret]': {
            requiredPrefixes: ['SUPER_SECRET_'],
          },
          'FieldDefinition[gqlType.name.value=Snake]': {
            style: 'snake_case',
            requiredPrefixes: ['hiss'],
          },
        },
      ],
      errors: 3,
    },
    {
      name: 'should error when selected type names do not match require suffixes',
      code: /* GraphQL */ `
        scalar IpAddress

        type Test {
          specialFeature: Boolean!
          user: IpAddress!
        }
      `,
      options: [
        {
          'FieldDefinition[gqlType.gqlType.name.value=Boolean]': {
            style: 'camelCase',
            requiredSuffixes: ['Enabled', 'Disabled'],
          },
          'FieldDefinition[gqlType.gqlType.name.value=IpAddress]': {
            requiredSuffixes: ['IpAddress'],
          },
        },
      ],
      errors: 2,
    },
    {
      name: 'forbiddenPatterns',
      code: 'query queryFoo { foo } query getBar { bar }',
      options: [{ OperationDefinition: { forbiddenPatterns: [/^(get|query)/] } }],
      errors: 2,
    },
    {
      name: 'requiredPattern',
      code: 'type Test { enabled: Boolean! }',
      options: [
        {
          'FieldDefinition[gqlType.gqlType.name.value=Boolean]': {
            style: 'camelCase',
            requiredPattern: /^(is|has)/,
          },
        },
      ],
      errors: 1,
    },
    {
      name: 'requiredPattern with case style in suffix',
      options: [
        {
          FragmentDefinition: {
            style: 'PascalCase',
            requiredPattern: /_(?<camelCase>.+?)$/,
          },
        },
      ],
      code: /* GraphQL */ `
        fragment UserProfileFields on User {
          id
        }
      `,
      parserOptions: {
        graphQLConfig: {
          schema: 'type User',
        },
      },
      errors: 1,
    },
  ],
});

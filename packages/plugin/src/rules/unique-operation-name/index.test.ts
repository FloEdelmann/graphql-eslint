import { join } from 'node:path';
import { CWD } from '@/utils.js';
import { ParserOptionsForTests, ruleTester } from '../../../__tests__/test-utils.js';
import { rule } from './index.js';

const TEST_OPERATION = 'query test { foo }';

const SIBLING_OPERATIONS = (...documents: string[]) => ({
  parserOptions: {
    graphQLConfig: {
      documents,
    },
  } satisfies ParserOptionsForTests,
});

ruleTester.run('unique-operation-name', rule, {
  valid: [
    {
      ...SIBLING_OPERATIONS(TEST_OPERATION),
      code: 'query test2 { foo }',
    },
    {
      // Compare filepath of code as real instead of virtual with siblings
      ...SIBLING_OPERATIONS(join(CWD, '__tests__/mocks/unique-fragment.js')),
      filename: join(CWD, '__tests__/mocks/unique-fragment.js/1_document.graphql'),
      code: /* GraphQL */ `
        query User {
          user {
            ...UserFields
          }
        }
      `,
    },
  ],
  invalid: [
    {
      ...SIBLING_OPERATIONS(TEST_OPERATION),
      code: 'query test { bar }',
      errors: [{ messageId: 'unique-operation-name' }],
    },
    {
      ...SIBLING_OPERATIONS(TEST_OPERATION, 'query test { bar2 }'),
      code: 'query test { bar }',
      errors: [{ messageId: 'unique-operation-name' }],
    },
  ],
});

// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[` 1`] = `
❌ Error

    > 1 | query { a }
        | ^^^^^ Anonymous GraphQL operations are forbidden. Please make sure to name your query!
`;

exports[` 2`] = `
❌ Error

    > 1 | mutation { a }
        | ^^^^^^^^ Anonymous GraphQL operations are forbidden. Please make sure to name your mutation!
`;

exports[` 3`] = `
❌ Error

    > 1 | subscription { a }
        | ^^^^^^^^^^^^ Anonymous GraphQL operations are forbidden. Please make sure to name your subscription!
`;
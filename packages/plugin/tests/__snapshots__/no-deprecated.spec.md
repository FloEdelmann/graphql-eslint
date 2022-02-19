// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[` 1`] = `
❌ Error

    > 1 | mutation { something(t: OLD) }
        |                         ^^^ This enum value is marked as deprecated in your GraphQL schema (reason: No longer supported)
`;

exports[` 2`] = `
❌ Error

    > 1 | mutation { something(t: OLD_WITH_REASON) }
        |                         ^^^^^^^^^^^^^^^ This enum value is marked as deprecated in your GraphQL schema (reason: test)
`;

exports[` 3`] = `
❌ Error

    > 1 | query { oldField }
        |         ^^^^^^^^ This field is marked as deprecated in your GraphQL schema (reason: No longer supported)
`;

exports[` 4`] = `
❌ Error

    > 1 | query { oldFieldWithReason }
        |         ^^^^^^^^^^^^^^^^^^ This field is marked as deprecated in your GraphQL schema (reason: test)
`;
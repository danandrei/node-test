const { gql } = require('apollo-server-express');

// Define our schema using the GraphQL schema language
const schema = gql`
  type User {
    id: Int!
    name: String!
    email: String!
  }
  type Access {
    accessToken: String!
    refreshToken: String!
  }
  type Query {
    me: User
  }
  type Mutation {
    signup(name: String!, email: String!, password: String!): Access
    login(email: String!, password: String!): Access
    refresh(refreshToken: String!): Access
  }
`;

module.exports = schema;

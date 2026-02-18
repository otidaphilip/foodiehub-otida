const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Restaurant {
    id: ID!
    name: String!
    location: String
    description: String
    imageUrl: String
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
    restaurantId: ID
    categoryId: ID
  }

  type Query {
    products: [Product]
    restaurants: [Restaurant]
  }
`;

module.exports = typeDefs;

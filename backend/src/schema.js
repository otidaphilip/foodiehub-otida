const { gql } = require("apollo-server-express");

const typeDefs = gql`

  # -------------------------
  # INPUT TYPES
  # -------------------------

  input AddRestaurantInput {
    name: String!
    location: String
    description: String
    image_url: String
  }

  input UpdateRestaurantInput {
    id: ID!
    name: String
    location: String
    description: String
    image_url: String
  }

  input AddCategoryInput {
    name: String!
  }

  input UpdateCategoryInput {
    id: ID!
    name: String
  }

  input AddProductInput {
    name: String!
    price: Float!
    restaurantId: ID!
    categoryId: ID!
    description: String
    image_url: String
  }

  input UpdateProductInput {
    id: ID!
    name: String
    price: Float
    restaurantId: ID
    categoryId: ID
    description: String
    image_url: String
  }

  input SearchProductInput {
    searchTerm: String
    categoryId: ID
    minPrice: Float
    maxPrice: Float
    restaurantId: ID
  }

  # -------------------------
  # CORE TYPES
  # -------------------------

  type Restaurant {
    id: ID!
    name: String!
    location: String
    description: String
    image_url: String
    products: [Product]
  }

  type Category {
    id: ID!
    name: String!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
    image_url: String
    restaurant: Restaurant
    category: Category
  }

  # -------------------------
  # QUERIES
  # -------------------------

  type Query {
    # Get All
    products: [Product]
    restaurants: [Restaurant]
    categories: [Category]

    # Get Single
    product(id: ID!): Product
    restaurant(id: ID!): Restaurant
    category(id: ID!): Category

    # Advanced Search
    searchProducts(input: SearchProductInput): [Product]
  }

  # -------------------------
  # MUTATIONS (FULL CRUD)
  # -------------------------

  type Mutation {

    # Restaurant CRUD
    addRestaurant(input: AddRestaurantInput!): Restaurant
    updateRestaurant(input: UpdateRestaurantInput!): Restaurant
    deleteRestaurant(id: ID!): Boolean

    # Category CRUD
    addCategory(input: AddCategoryInput!): Category
    updateCategory(input: UpdateCategoryInput!): Category
    deleteCategory(id: ID!): Boolean

    # Product CRUD
    addProduct(input: AddProductInput!): Product
    updateProduct(input: UpdateProductInput!): Product
    deleteProduct(id: ID!): Boolean
  }
`;

module.exports = typeDefs;

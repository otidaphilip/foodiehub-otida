import { gql } from "graphql-tag";

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
    image_url: String
    restaurant: Restaurant
    category: Category
  }

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

  input SearchProductsInput {
    searchTerm: String
    categoryId: Int
    restaurantId: Int
    minPrice: Float
    maxPrice: Float
  }

  type Query {
    products: [Product!]!
    product(id: Int!): Product

    restaurants: [Restaurant!]!
    restaurant(id: Int!): Restaurant

    categories: [Category!]!
    category(id: Int!): Category

    searchProducts(input: SearchProductsInput): [Product!]!
  }

  type Mutation {
    addRestaurant(input: RestaurantInput!): Restaurant
    updateRestaurant(input: UpdateRestaurantInput!): Restaurant
    deleteRestaurant(id: Int!): Boolean

    addCategory(input: CategoryInput!): Category
    updateCategory(input: UpdateCategoryInput!): Category
    deleteCategory(id: Int!): Boolean

    addProduct(input: ProductInput!): Product
    updateProduct(input: UpdateProductInput!): Product
    deleteProduct(id: Int!): Boolean
  }

  input RestaurantInput {
    name: String!
    location: String
    description: String
    imageUrl: String
  }

  input UpdateRestaurantInput {
    id: Int!
    name: String
    location: String
    description: String
    imageUrl: String
  }

  input CategoryInput {
    name: String!
  }

  input UpdateCategoryInput {
    id: Int!
    name: String
  }

  input ProductInput {
    name: String!
    price: Float!
    restaurantId: Int!
    categoryId: Int!
    description: String
    imageUrl: String
  }

  input UpdateProductInput {
    id: Int!
    name: String
    price: Float
    restaurantId: Int
    categoryId: Int
    description: String
    imageUrl: String
  }
`;

export default typeDefs;
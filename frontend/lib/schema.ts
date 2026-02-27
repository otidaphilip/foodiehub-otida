const typeDefs = `#graphql
  # -------- INPUTS --------

  input AddRestaurantInput {
    name: String!
    location: String
    description: String
  }

  input UpdateRestaurantInput {
    id: ID!
    name: String
    location: String
    description: String
  }

  input AddProductInput {
    name: String!
    price: Float!
    restaurantId: ID!
    categoryId: ID!
    description: String
    imageUrl: String
  }

  input SearchProductInput {
    searchTerm: String
    categoryId: ID
    minPrice: Float
    maxPrice: Float
    restaurantId: ID
  }

  # -------- CORE TYPES --------

  type Restaurant {
    id: ID!
    name: String!
    location: String
    description: String
    products: [Product]
    imageUrl: String
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
    restaurant: Restaurant
    category: Category
    imageUrl: String
  }

  type Category {
    id: ID!
    name: String!
  }

  # -------- QUERIES --------

  type Query {
    products: [Product]
    restaurants: [Restaurant]
    categories: [Category]

    product(id: ID!): Product
    restaurant(id: ID!): Restaurant

    searchProducts(input: SearchProductInput): [Product]
  }

  # -------- MUTATIONS --------

  type Mutation {
    addRestaurant(input: AddRestaurantInput!): Restaurant
    updateRestaurant(input: UpdateRestaurantInput!): Restaurant
    addProduct(input: AddProductInput!): Product
    deleteProduct(id: ID!): Boolean
  }
`;

export default typeDefs;
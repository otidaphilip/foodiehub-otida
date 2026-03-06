const typeDefs = `#graphql

# -------- INPUTS --------

input AddRestaurantInput {
  name: String!
  location: String
  description: String
  imageUrl: String
}

input UpdateRestaurantInput {
  id: ID!
  name: String
  location: String
  description: String
  imageUrl: String
}

input AddCategoryInput {
  name: String!
}

input UpdateCategoryInput {
  id: ID!
  name: String!
}

input AddProductInput {
  name: String!
  price: Float!
  restaurantId: ID!
  categoryId: ID!
  description: String
  imageUrl: String
}

input UpdateProductInput {
  id: ID!
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

# -------- TYPES --------

type Restaurant {
  id: ID!
  name: String!
  location: String
  description: String
  imageUrl: String
  products: [Product]
}

type Product {
  id: ID!
  name: String!
  price: Float!
  description: String
  imageUrl: String
  restaurant: Restaurant
  category: Category
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
  category(id: ID!): Category

  searchProducts(input: SearchProductInput): [Product]
}

# -------- MUTATIONS --------

type Mutation {
  addRestaurant(input: AddRestaurantInput!): Restaurant
  updateRestaurant(input: UpdateRestaurantInput!): Restaurant
  deleteRestaurant(id: ID!): Boolean

  addCategory(input: AddCategoryInput!): Category
  updateCategory(input: UpdateCategoryInput!): Category
  deleteCategory(id: ID!): Boolean

  addProduct(input: AddProductInput!): Product
  updateProduct(input: UpdateProductInput!): Product
  deleteProduct(id: ID!): Boolean
}
`;

export default typeDefs;
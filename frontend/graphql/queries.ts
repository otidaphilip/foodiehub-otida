import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
      image_url
      restaurant {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($input: SearchProductInput) {
    searchProducts(input: $input) {
      id
      name
      price
      image_url
      restaurant {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`;

export const GET_RESTAURANT = gql`
  query($id: ID!) {
    restaurant(id: $id) {
      id
      name
      location
      description
      products {
        id
        name
        price
        image_url
      }
    }
  }
`;
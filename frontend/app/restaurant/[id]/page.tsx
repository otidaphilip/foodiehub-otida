"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";

const GET_RESTAURANT = gql`
  query GetRestaurant($id: ID!) {
    restaurant(id: $id) {
      id
      name
      description
      products {
        id
        name
        price
        imageUrl
      }
    }
  }
`;

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  products: Product[];
}

interface GetRestaurantData {
  restaurant: Restaurant;
}

export default function RestaurantPage() {
  const params = useParams();
  const { data, loading } = useQuery<GetRestaurantData>(GET_RESTAURANT, {
    variables: { id: params.id },
  });

  if (loading) return <p>Loading...</p>;
  if (!data) return null;

  const restaurant = data.restaurant;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description}</p>

      <h2>Menu</h2>

      {restaurant.products.map((product) => (
        <div key={product.id}>
          <p>
            {product.name} - ${product.price}
          </p>
        </div>
      ))}
    </div>
  );
}
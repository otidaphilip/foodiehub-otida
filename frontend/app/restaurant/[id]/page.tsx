"use client";

import { useQuery } from "@apollo/client/react";
import { GET_RESTAURANT } from "@/graphql/queries";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

/* ✅ Define query response type */
interface GetRestaurantResponse {
  restaurant: Restaurant;
}

/* ✅ Define query variables type */
interface GetRestaurantVariables {
  id: string;
}

export default function RestaurantDetail({
  params,
}: {
  params: { id: string };
}) {
  const { data, loading, error } = useQuery<
    GetRestaurantResponse,
    GetRestaurantVariables
  >(GET_RESTAURANT, {
    variables: { id: params.id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading restaurant</p>;
  if (!data) return null;

  const restaurant = data.restaurant;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description}</p>

      {restaurant.products.map((product) => (
        <div key={product.id}>
          <img src={product.image_url} width={120} alt={product.name} />
          <p>
            {product.name} - ${product.price}
          </p>
        </div>
      ))}
    </div>
  );
}
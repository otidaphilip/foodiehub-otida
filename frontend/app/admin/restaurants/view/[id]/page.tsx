"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Restaurant {
  id: number;
  name: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  products?: Product[];
}

interface RestaurantData {
  restaurant: Restaurant;
}

const GET_RESTAURANT = gql`
  query GetRestaurant($id: ID!) {
    restaurant(id: $id) {
      id
      name
      location
      description
      imageUrl
      products {
        id
        name
        price
      }
    }
  }
`;

export default function ViewRestaurant() {
  const { id } = useParams();
  const router = useRouter();

  const { data, loading, error } = useQuery<RestaurantData>(
    GET_RESTAURANT,
    {
      variables: { id: Number(id) },
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error || !data?.restaurant)
    return <p>Restaurant not found.</p>;

  const r = data.restaurant;

  return (
    <div className="container">
      <button onClick={() => router.push("/admin/restaurants")}>
        ← Back
      </button>

      <h1>{r.name}</h1>
      <p><strong>Location:</strong> {r.location}</p>
      <p><strong>Description:</strong> {r.description}</p>

      <h2>Products</h2>
      <ul>
        {r.products?.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
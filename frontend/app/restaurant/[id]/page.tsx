"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";

/* =========================
   Query
========================= */

const GET_RESTAURANT = gql`
  query GetRestaurant($id: ID!) {
    restaurant(id: $id) {
      id
      name
      location
      description
    }
    searchProducts(input: { restaurantId: $id }) {
      id
      name
      price
      imageUrl
    }
  }
`;

/* =========================
   Types
========================= */

interface Restaurant {
  id: string;
  name: string;
  location?: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

interface RestaurantData {
  restaurant: Restaurant;
  searchProducts: Product[];
}

export default function RestaurantPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, loading, error } = useQuery<RestaurantData>(
    GET_RESTAURANT,
    {
      variables: { id },
      skip: !id,
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading restaurant</p>;

  if (!data) return null;

return (
  <div className="container">
    {/* Restaurant Info */}
    <div className="restaurant-header">
      <h1 className="page-title">{data.restaurant.name}</h1>
      <p className="restaurant-location">
        📍 {data.restaurant.location}
      </p>
      <p className="restaurant-description">
        {data.restaurant.description}
      </p>
    </div>

    {/* Products Section */}
    <h2 className="section-title">
      Available Products from this Restaurant
    </h2>

    <div className="grid">
      {data.searchProducts.map((product) => (
        <div key={product.id} className="card">
          <img
            src={product.imageUrl || "/placeholder.jpg"}
            alt={product.name}
          />

          <div className="card-content">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}
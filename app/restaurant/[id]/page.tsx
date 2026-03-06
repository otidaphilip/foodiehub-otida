"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";

/* =========================
   Types
========================= */

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
  products?: Product[] | null;
}

interface RestaurantData {
  restaurant: Restaurant | null;
}

/* =========================
   Query
========================= */

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

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id)
    ? params?.id[0]
    : params?.id;

  const { data, loading, error } = useQuery<RestaurantData>(
    GET_RESTAURANT,
    {
      variables: { id },
      skip: !id,
      fetchPolicy: "network-only",
    }
  );

  if (!id) return <p>Invalid restaurant ID</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!data?.restaurant) return <p>Restaurant not found</p>;

  const restaurant = data.restaurant;
  const products = restaurant.products ?? [];

  return (
    <div className="container">
      
      {/* 🔙 Back Button */}
      <button
        className="button"
        style={{ marginBottom: "20px" }}
        onClick={() => router.push("/restaurants")}
      >
        ← Back to Restaurants
      </button>

      <div className="restaurant-header">
        <h1 className="page-title">{restaurant.name}</h1>
        <p className="restaurant-description">
          {restaurant.description || "No description available."}
        </p>
      </div>

      <h2 className="section-title">Menu</h2>

      <div className="grid">
        {products.length === 0 ? (
          <p className="muted">
            No products available for this restaurant.
          </p>
        ) : (
          products.map((product) => (
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
          ))
        )}
      </div>
    </div>
  );
}
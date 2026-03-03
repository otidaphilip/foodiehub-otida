"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";

/* =========================
   Types
========================= */

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface RestaurantsData {
  restaurants: Restaurant[];
}

/* =========================
   Query
========================= */

const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      description
      imageUrl
    }
  }
`;

export default function RestaurantsPage() {
  const router = useRouter();

  const { data, loading, error } =
    useQuery<RestaurantsData>(GET_RESTAURANTS);

  if (loading) return <p>Loading restaurants...</p>;
  if (error) return <p>{error.message}</p>;

  const restaurants = data?.restaurants ?? [];

  return (
    <div className="container">
      
      {/* 🔙 Back Button */}
      <button
        className="button"
        style={{ marginBottom: "20px" }}
        onClick={() => router.push("/")}
      >
        ← Back to Home
      </button>

      <h1 className="page-title">All Restaurants</h1>

      {restaurants.length === 0 ? (
        <p className="muted">No restaurants available.</p>
      ) : (
        <div className="grid">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="card">
              <img
                src={restaurant.imageUrl || "/placeholder.jpg"}
                alt={restaurant.name}
              />

              <div className="card-content">
                <h3 className="product-name">
                  {restaurant.name}
                </h3>

                <p className="muted">
                  {restaurant.description}
                </p>

                <button
                  className="button"
                  onClick={() =>
                    router.push(`/restaurant/${restaurant.id}`)
                  }
                >
                  View Restaurant
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
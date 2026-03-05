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
  if (error || !data?.restaurant) return <p>Restaurant not found.</p>;

  const r = data.restaurant;

  return (
    <div className="view-product-wrapper">
      <div className="container">
        <button
          className="admin-add back-btn"
          onClick={() => router.push("/admin/restaurants")}
        >
          ← Back
        </button>

        <div className="view-product-card">
          
          {/* LEFT SIDE IMAGE */}
          <div className="view-product-left">
            <img
              src={r.imageUrl || "/placeholder.jpg"}
              alt={r.name}
              className="view-product-image"
            />
          </div>

          {/* RIGHT SIDE DETAILS */}
          <div className="view-product-right">
            <h3 className="product-id">Restaurant ID: {r.id}</h3>

            <h1 className="product-name">{r.name}</h1>

            {r.location && (
              <p className="product-restaurant">
                <strong>Location:</strong> {r.location}
              </p>
            )}

            {r.description && (
              <p className="product-description">
                <strong>Description:</strong> {r.description}
              </p>
            )}

            {/* PRODUCTS LIST */}
            <div style={{ marginTop: "20px" }}>
              <strong>Products:</strong>

              {r.products && r.products.length > 0 ? (
                <ul style={{ marginTop: "10px" }}>
                  {r.products.map((p) => (
                    <li key={p.id}>
                      {p.name} - ${p.price}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No products available.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
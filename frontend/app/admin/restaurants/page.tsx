"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";

interface Restaurant {
  id: string;
  name: string;
  location?: string;
  description?: string;
}

interface RestaurantsData {
  restaurants: Restaurant[];
}

const GET_RESTAURANTS = gql`
  query {
    restaurants {
      id
      name
      location
      description
    }
  }
`;

export default function ManageRestaurants() {
  const router = useRouter();
  const { data, loading, error } =
    useQuery<RestaurantsData>(GET_RESTAURANTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading restaurants</p>;

  const restaurants = data?.restaurants ?? [];

  return (
    <div className="container">

      <div className="admin-header">
        <button
          className="admin-back"
          onClick={() => router.push("/admin")}
        >
          ← Back
        </button>

        <h1 className="page-title">Manage Restaurants</h1>

        <button className="admin-add">
          + Add Restaurant
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {restaurants.map((restaurant) => (
            <tr key={restaurant.id}>
              <td>{restaurant.name}</td>
              <td>{restaurant.location}</td>
              <td>{restaurant.description}</td>
              <td className="action-buttons">
                <button className="view-btn">View</button>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
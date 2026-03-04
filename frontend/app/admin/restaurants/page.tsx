"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
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

const DELETE_RESTAURANT = gql`
  mutation DeleteRestaurant($id: ID!) {
    deleteRestaurant(id: $id)
  }
`;

export default function ManageRestaurants() {
  const router = useRouter();

  const { data, loading, error, refetch } =
    useQuery<RestaurantsData>(GET_RESTAURANTS);

  const [deleteRestaurant] = useMutation(DELETE_RESTAURANT, {
    onCompleted: () => {
      refetch();
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading restaurants</p>;

  const restaurants = data?.restaurants ?? [];

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this restaurant?");
    if (!confirmDelete) return;

    await deleteRestaurant({
      variables: { id },
    });
  };

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

        <button
          className="admin-add"
          onClick={() => router.push("/admin/restaurants/add")}
        >
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
                
                <button
                  className="view-btn"
                  onClick={() =>
                    router.push(`/admin/restaurants/view/${restaurant.id}`)
                  }
                >
                  View
                </button>

                <button
                  className="edit-btn"
                  onClick={() =>
                    router.push(`/admin/restaurants/edit/${restaurant.id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(restaurant.id)}
                >
                  Delete
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
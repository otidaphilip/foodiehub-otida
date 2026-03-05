"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Restaurant {
  id: number;
  name: string;
  location?: string;
  description?: string;
  imageUrl?: string;
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
    }
  }
`;

const UPDATE_RESTAURANT = gql`
  mutation UpdateRestaurant($input: UpdateRestaurantInput!) {
    updateRestaurant(input: $input) {
      id
      name
      location
      description
      imageUrl
    }
  }
`;

export default function EditRestaurant() {
  const { id } = useParams();
  const router = useRouter();

  const { data } = useQuery<RestaurantData>(GET_RESTAURANT, {
    variables: { id: Number(id) },
  });

  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
  });

  const [updateRestaurant, { loading, error }] = useMutation(
    UPDATE_RESTAURANT,
    {
      onCompleted: () => {
        router.push("/admin/restaurants");
      },
    }
  );

  useEffect(() => {
    if (data?.restaurant) {
      setForm({
        name: data.restaurant.name,
        location: data.restaurant.location || "",
        description: data.restaurant.description || "",
        imageUrl: data.restaurant.imageUrl || "",
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateRestaurant({
      variables: {
        input: {
          id: Number(id),
          ...form,
        },
      },
    });
  };

  return (
    <div className="container center">
      {/* Back */}
      <button
        className="admin-back-orange"
        onClick={() => router.push("/admin/restaurants")}
      >
        ← Back
      </button>

      <div className="form-section">
        {error && <p className="error-message">{error.message}</p>}

        <h1 className="page-title">Edit Restaurant</h1>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-row">
            <label>Location</label>
            <input
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label>Image URL</label>
            <input
              value={form.imageUrl}
              onChange={(e) =>
                setForm({ ...form, imageUrl: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="admin-add"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Restaurant"}
          </button>
        </form>
      </div>
    </div>
  );
}
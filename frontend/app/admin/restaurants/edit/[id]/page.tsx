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

  const { data } = useQuery<RestaurantData>(
    GET_RESTAURANT,
    {
      variables: { id: Number(id) },
    }
  );

  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
  });

  const [updateRestaurant, { loading, error }] =
    useMutation(UPDATE_RESTAURANT, {
      onCompleted: () => {
        router.push("/admin/restaurants");
      },
    });

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
    <div className="container">
      <h1>Edit Restaurant</h1>

      {error && <p style={{ color: "red" }}>{error.message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) =>
            setForm({ ...form, imageUrl: e.target.value })
          }
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
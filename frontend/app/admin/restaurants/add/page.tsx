"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ADD_RESTAURANT = gql`
  mutation AddRestaurant($input: AddRestaurantInput!) {
    addRestaurant(input: $input) {
      id
      name
      location
      description
    }
  }
`;

export default function AddRestaurant() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
  });

  const [addRestaurant, { loading, error }] = useMutation(
    ADD_RESTAURANT,
    {
      onCompleted: () => {
        router.push("/admin/restaurants");
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRestaurant({ variables: { input: form } });
  };

  return (
    <div className="container">
      <h1>Add Restaurant</h1>

      {error && <p style={{ color: "red" }}>{error.message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
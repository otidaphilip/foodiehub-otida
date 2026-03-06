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
      imageUrl
    }
  }
`;

export default function AddRestaurant() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
  });

  const [addRestaurant, { loading, error }] = useMutation(
    ADD_RESTAURANT,
    {
      onCompleted: () => router.push("/admin/restaurants"),
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addRestaurant({
      variables: { input: form },
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

        <h1 className="page-title">Add Restaurant</h1>

        {error && (
          <div className="error-message">{error.message}</div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>

          <div className="form-row">
            <label>Name</label>
            <input
              placeholder="Restaurant name"
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
              placeholder="Restaurant location"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label>Description</label>
            <textarea
              placeholder="Restaurant description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label>Image URL</label>
            <input
              placeholder="Paste image URL"
              value={form.imageUrl}
              onChange={(e) =>
                setForm({ ...form, imageUrl: e.target.value })
              }
            />
          </div>

          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              style={{
                width: "100%",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            />
          )}

          <button className="admin-add" disabled={loading}>
            {loading ? "Saving..." : "Create Restaurant"}
          </button>

        </form>
      </div>
    </div>
  );
}
"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter, useParams } from "next/navigation";

const DELETE_RESTAURANT = gql`
  mutation DeleteRestaurant($id: ID!) {
    deleteRestaurant(id: $id)
  }
`;

export default function DeleteRestaurantPage() {
  const { id } = useParams();
  const router = useRouter();

  const [deleteRestaurant, { loading, error }] = useMutation(
    DELETE_RESTAURANT,
    {
      onCompleted: () => router.push("/admin/restaurants"),
    }
  );

  const handleDelete = async () => {
    await deleteRestaurant({
      variables: { id },
    });
  };

  return (
    <div className="container center">

      {/* Back Button */}
      <button
        className="admin-back-orange"
        onClick={() => router.push("/admin/restaurants")}
      >
        ← Back
      </button>

      {/* Confirmation Card */}
      <div className="form-section">

        <h1 className="page-title">Delete Restaurant</h1>

        <p className="muted">
          Are you sure you want to delete this restaurant?
        </p>

        <p style={{ color: "#ff4d4d", fontWeight: 500 }}>
          This action cannot be undone.
        </p>

        {error && (
          <div className="error-message">
            {error.message}
          </div>
        )}

        <div style={{
          display: "flex",
          gap: "12px",
          marginTop: "25px"
        }}>

          {/* Delete Button */}
          <button
            className="delete-btn"
            style={{
              height: "40px",
              padding: "0 18px"
            }}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete Restaurant"}
          </button>

          {/* Cancel Button */}
          <button
            className="view-btn"
            style={{
              height: "40px",
              padding: "0 18px"
            }}
            onClick={() => router.push("/admin/restaurants")}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}
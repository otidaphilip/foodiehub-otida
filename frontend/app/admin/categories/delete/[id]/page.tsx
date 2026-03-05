"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export default function DeleteCategory() {
  const { id } = useParams();
  const router = useRouter();

  const [deleteCategory, { loading, error }] = useMutation(
    DELETE_CATEGORY,
    {
      onCompleted: () => router.push("/admin/categories"),
    }
  );

  const handleDelete = async () => {
    await deleteCategory({
      variables: { id: Number(id) },
    });
  };

  return (
    <div className="container center">

      {/* Back Button */}
      <button
        className="admin-back-orange"
        onClick={() => router.push("/admin/categories")}
      >
        ← Back
      </button>

      {/* Confirmation Card */}
      <div className="form-section">

        <h1 className="page-title">Delete Category</h1>

        <p className="muted">
          Are you sure you want to delete this category?
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
            style={{ height: "40px", padding: "0 18px" }}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete Category"}
          </button>

          {/* Cancel Button */}
          <button
            className="view-btn"
            style={{ height: "40px", padding: "0 18px" }}
            onClick={() => router.push("/admin/categories")}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}
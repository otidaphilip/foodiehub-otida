"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter, useParams } from "next/navigation";

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export default function DeleteProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [deleteProduct, { loading, error }] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => router.push("/admin/products"),
  });

  const handleDelete = async () => {
    await deleteProduct({ variables: { id } });
  };

  return (
    <div className="container center">

      {/* Back Button */}
      <button
        className="admin-back-orange"
        onClick={() => router.push("/admin/products")}
      >
        ← Back
      </button>

      {/* Delete Card */}
      <div className="form-section">

        <h1 className="page-title">Delete Product</h1>

        <p className="muted">
          Are you sure you want to delete this product?
        </p>

        <p style={{ color: "#ff4d4d", fontWeight: 500 }}>
          This action cannot be undone.
        </p>

        {error && (
          <div className="error-message">
            {error.message}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>

          <button
            className="delete-btn"
            style={{ height: "40px", padding: "0 18px" }}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete Product"}
          </button>

          <button
            className="view-btn"
            style={{ height: "40px", padding: "0 18px" }}
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}
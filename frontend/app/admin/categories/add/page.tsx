"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ADD_CATEGORY = gql`
  mutation AddCategory($input: AddCategoryInput!) {
    addCategory(input: $input) {
      id
      name
    }
  }
`;

export default function AddCategory() {
  const router = useRouter();
  const [name, setName] = useState("");

  const [addCategory, { loading, error }] = useMutation(ADD_CATEGORY, {
    onCompleted: () => router.push("/admin/categories"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addCategory({
      variables: { input: { name } },
    });
  };

  return (
    <div className="container center">
      {/* Back */}
      <button
        className="admin-back-orange"
        onClick={() => router.push("/admin/categories")}
      >
        ← Back
      </button>

      <div className="form-section">

        <h1 className="page-title">Add Category</h1>

        {error && (
          <div className="error-message">{error.message}</div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>

          <div className="form-row">
            <label>Category Name</label>
            <input
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <button className="admin-add" disabled={loading}>
            {loading ? "Creating..." : "Create Category"}
          </button>

        </form>
      </div>
    </div>
  );
}
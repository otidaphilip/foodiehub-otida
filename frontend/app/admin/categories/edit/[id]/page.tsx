"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const GET_CATEGORY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      id
      name
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      id
      name
    }
  }
`;

type Category = {
  id: number;
  name: string;
};

type GetCategoryData = {
  category: Category;
};

export default function EditCategory() {
  const { id } = useParams();
  const router = useRouter();

  const { data, loading } = useQuery<GetCategoryData>(GET_CATEGORY, {
    variables: { id: Number(id) },
  });

  const [name, setName] = useState("");

  useEffect(() => {
    if (data?.category) {
      setName(data.category.name);
    }
  }, [data]);

  const [updateCategory, { loading: updating, error }] = useMutation(
    UPDATE_CATEGORY,
    {
      onCompleted: () => {
        router.push("/admin/categories");
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateCategory({
      variables: {
        input: {
          id: Number(id),
          name,
        },
      },
    });
  };

  if (loading) return <p>Loading...</p>;

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
        {error && <p className="error-message">{error.message}</p>}

        <h1 className="page-title">Edit Category</h1>


        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Category Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="admin-add"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface CategoriesData {
  categories: Category[];
}

const GET_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`;

export default function ManageCategories() {
  const router = useRouter();
  const { data, loading, error } =
    useQuery<CategoriesData>(GET_CATEGORIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories</p>;

  const categories = data?.categories ?? [];

  return (
    <div className="container">

      <div className="admin-header">
        <button
          className="admin-back"
          onClick={() => router.push("/admin")}
        >
          ← Back
        </button>

        <h1 className="page-title">Manage Categories</h1>

        <button className="admin-add">
          + Add Category
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td className="action-buttons">
                <button className="view-btn">View</button>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
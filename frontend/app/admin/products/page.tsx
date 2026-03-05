"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  restaurant?: { name: string };
  category?: { name: string };
}

interface ProductsData {
  products: Product[];
}

// GraphQL query
const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
      restaurant { name }
      category { name }
    }
  }
`;

export default function ManageProducts() {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery<ProductsData>(GET_PRODUCTS);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products</p>;

  const products = data?.products ?? [];

  return (
    <div className="container">
      {/* Header */}
      <div className="admin-header">
        <button className="admin-add" onClick={() => router.push("/admin")}>
          ← Back
        </button>
        <h1 className="page-title">Manage Products</h1>
        <button className="admin-add" onClick={() => router.push("/admin/products/add")}>
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Restaurant</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.restaurant?.name || "-"}</td>
              <td>{product.category?.name || "-"}</td>
              <td className="action-buttons">
                <button
                  className="view-btn"
                  onClick={() => router.push(`/admin/products/view/${product.id}`)}
                >
                  View
                </button>
                <button
                  className="edit-btn"
                  onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => router.push(`/admin/products/delete/${product.id}`)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;

  const products = data?.products ?? [];

  return (
    <div className="container">
      <div className="admin-header">
        <button className="admin-back" onClick={() => router.push("/admin")}>
          ← Back
        </button>
        <h1 className="page-title">Manage Products</h1>
        <button className="admin-add" onClick={() => router.push("/admin/products/add")}>
          + Add Product
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Restaurant</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: Product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.restaurant?.name}</td>
              <td>{product.category?.name}</td>
              <td className="action-buttons">
                <button onClick={() => router.push(`/admin/products/view/${product.id}`)}>View</button>
                <button onClick={() => router.push(`/admin/products/edit/${product.id}`)}>Edit</button>
                <button onClick={() => router.push(`/admin/products/delete/${product.id}`)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
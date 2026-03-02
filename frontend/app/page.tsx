"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      imageUrl
      restaurant {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`;

// ✅ Define TypeScript types
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  restaurant?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

interface GetProductsData {
  products: Product[];
}

export default function HomePage() {
  const { data, loading, error } = useQuery<GetProductsData>(GET_PRODUCTS);
  const [search, setSearch] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;
  if (!data) return null;

  const filteredProducts = data.products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>FoodieHub</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", marginBottom: "20px", width: "300px" }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <img
              src={product.imageUrl || ""}
              alt={product.name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>
              <strong>{product.restaurant?.name}</strong>
            </p>
            <p>{product.category?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
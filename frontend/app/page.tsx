"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { SEARCH_PRODUCTS } from "@/graphql/queries";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  restaurant: {
    id: string;
    name: string;
  };
}

interface SearchProductsData {
  searchProducts: Product[];
}

interface SearchProductsVars {
  input?: {
    searchTerm?: string;
  };
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading } = useQuery<
    SearchProductsData,
    SearchProductsVars
  >(SEARCH_PRODUCTS, {
    variables: {
      input: { searchTerm },
    },
  });

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        🍽 FoodieHub Marketplace
      </h1>

      {/* Search Input */}
      <input
        placeholder="Search food..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginBottom: "30px",
        }}
      />

      {loading && <p>Loading delicious food...</p>}

      {/* Product Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "24px",
        }}
      >
        {data?.searchProducts.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "0.3s ease",
              backgroundColor: "#fff",
            }}
          >
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "16px" }}>
              <h3 style={{ marginBottom: "8px" }}>{product.name}</h3>

              <p style={{ fontWeight: "bold", marginBottom: "4px" }}>
                ${product.price.toFixed(2)}
              </p>

              <p style={{ color: "#777", fontSize: "14px", marginBottom: "12px" }}>
                {product.restaurant.name}
              </p>

              <Link
                href={`/restaurant/${product.restaurant.id}`}
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                View Restaurant →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!loading && data?.searchProducts.length === 0 && (
        <p style={{ marginTop: "40px", textAlign: "center" }}>
          No food found 🍕
        </p>
      )}
    </div>
  );
}
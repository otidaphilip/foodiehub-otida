"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";

/* =========================
   Types
========================= */

interface Restaurant {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  restaurant?: Restaurant;
  category?: Category;
}

interface ProductData {
  product: Product;
}

/* =========================
   Query
========================= */

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
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

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, loading, error } = useQuery<ProductData>(GET_PRODUCT, {
    variables: { id },
  });

  if (loading) return <p className="container">Loading...</p>;
  if (error) return <p className="container">{error.message}</p>;
  if (!data?.product) return <p className="container">Product not found</p>;

  const product = data.product;

  return (
    <div className="container">

      {/* Back Button */}
      <button
        className="admin-back back-btn"
        onClick={() => router.push("/")}
      >
        ← Back to Home
      </button>

      {/* Center Layout */}
      <div className="view-product-wrapper">

        <div className="view-product-card">

          {/* LEFT SIDE (Image) */}
          <div className="view-product-left">
            <img
              src={product.imageUrl || "/placeholder.jpg"}
              alt={product.name}
              className="view-product-image"
            />
          </div>

          {/* RIGHT SIDE (Details) */}
          <div className="view-product-right">

            <div className="product-id">
              PRODUCT ID: {product.id}
            </div>

            <h2 className="product-name">
              {product.name}
            </h2>

            <div className="product-price">
              ${product.price}
            </div>

            <p className="product-category">
              Category: {product.category?.name || "N/A"}
            </p>

            <p className="product-restaurant">
              Restaurant: {product.restaurant?.name || "N/A"}
            </p>

            <p className="product-description">
              {product.description || "No description available."}
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}
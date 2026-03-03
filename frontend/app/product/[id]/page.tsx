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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!data?.product) return <p>Product not found</p>;

  const product = data.product;

  return (
    <div className="container">
      <div className="card">
        <img
          src={product.imageUrl || "/placeholder.jpg"}
          alt={product.name}
        />

        <div className="card-content">
          <h2 className="page-title">{product.name}</h2>
          <p className="product-price">${product.price}</p>
          <p className="muted">{product.category?.name}</p>
          <p className="restaurant-location">
            From: {product.restaurant?.name}
          </p>
          <p className="restaurant-description">
            {product.description}
          </p>

          <button
            className="button"
            onClick={() =>
              router.push(`/restaurant/${product.restaurant?.id}`)
            }
          >
            View Restaurant
          </button>
        </div>
      </div>
    </div>
  );
}
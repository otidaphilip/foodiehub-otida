"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";    
import { useParams, useRouter } from "next/navigation";

// GraphQL query
const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      price
      description
      imageUrl
      restaurant { name }
      category { name }
    }
  }
`;

// TypeScript interfaces
interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  restaurant?: { name: string };
  category?: { name: string };
}

interface ProductData {
  product: Product;
}

export default function ViewProduct() {
  const { id } = useParams();
  const router = useRouter();

  const { data, loading, error } = useQuery<ProductData>(GET_PRODUCT, { variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error || !data?.product) return <p>Product not found.</p>;

  const product = data.product;

  return (
  <div className="view-product-wrapper">
    <div className="container">
      <button
        className="admin-add back-btn"
        onClick={() => router.push("/admin/products")}
      >
        ← Back
      </button>

      <div className="view-product-card">
        <div className="view-product-left">
          <img
            src={product.imageUrl || "/placeholder.jpg"}
            alt={product.name}
            className="view-product-image"
          />
        </div>

        <div className="view-product-right">
          <h3 className="product-id">ID Number: {product.id}</h3>
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">
            Price: ${product.price.toFixed(2)}
          </p>

          {product.description && (
            <p className="product-description">
              <strong>Description:</strong> {product.description}
            </p>
          )}

          <p className="product-restaurant">
            <strong>Restaurant:</strong>{" "}
            {product.restaurant?.name || "-"}
          </p>

          <p className="product-category">
            <strong>Category:</strong>{" "}
            {product.category?.name || "-"}
          </p>
        </div>
      </div>
    </div>
  </div>
);
}
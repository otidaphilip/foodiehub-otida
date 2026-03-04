"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";    
import { useParams, useRouter } from "next/navigation";

// GraphQL query (fixed field names to match backend)
const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      price
      description
      imageUrl   # <-- fixed
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
  imageUrl?: string;  // <-- fixed
  restaurant?: { name: string };
  category?: { name: string };
}

interface ProductData {
  product: Product;
}

export default function ViewProduct() {
  const { id } = useParams();
  const router = useRouter();

  // ✅ Tell TypeScript the type of data returned
  const { data, loading, error } = useQuery<ProductData>(GET_PRODUCT, { variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error || !data?.product) return <p>Product not found.</p>;

  const product = data.product;

  return (
    <div className="container">
      <button onClick={() => router.push("/admin/products")}>← Back</button>
      <h1>{product.name}</h1>
      <img src={product.imageUrl || "/placeholder.jpg"} alt={product.name} />
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Restaurant:</strong> {product.restaurant?.name}</p>
      <p><strong>Category:</strong> {product.category?.name}</p>
    </div>
  );
}
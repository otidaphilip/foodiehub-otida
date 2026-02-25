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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <input
        placeholder="Search food..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div>
        {data?.searchProducts.map((product) => (
          <div key={product.id}>
            <img
              src={product.image_url}
              alt={product.name}
              width={200}
            />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>{product.restaurant.name}</p>

            <Link href={`/restaurant/${product.restaurant.id}`}>
              View Restaurant
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
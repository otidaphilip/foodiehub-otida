"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

/* =========================
   GraphQL Queries
========================= */

const GET_FILTER_DATA = gql`
  query GetFilterData {
    restaurants {
      id
      name
    }
    categories {
      id
      name
    }
  }
`;

const GET_PRODUCTS = gql`
  query GetProducts($input: SearchProductInput) {
    searchProducts(input: $input) {
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
  price: number;
  imageUrl?: string;
  restaurant?: Restaurant;
  category?: Category;
}

interface FilterData {
  restaurants: Restaurant[];
  categories: Category[];
}

interface ProductsData {
  searchProducts: Product[];
}

export default function HomePage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data: filterData } = useQuery<FilterData>(GET_FILTER_DATA);

  const { data, loading, error } = useQuery<ProductsData>(GET_PRODUCTS, {
    variables: {
      input: {
        searchTerm: search || undefined,
        categoryId: categoryId || undefined,
        restaurantId: restaurantId || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  const products = data?.searchProducts ?? [];

  return (
  <div className="container">
    <h1 className="page-title">FoodieHub</h1>

    {/* Search */}
    <div className="filters-wrapper">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input"
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="select"
      >
        <option value="">All Categories</option>
        {filterData?.categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={restaurantId}
        onChange={(e) => setRestaurantId(e.target.value)}
        className="select"
      >
        <option value="">All Restaurants</option>
        {filterData?.restaurants?.map((res) => (
          <option key={res.id} value={res.id}>
            {res.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="input"
      />

      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="input"
      />
    </div>

    {/* Products */}
    <div className="grid">
      {products.map((product) => (
        <div key={product.id} className="card">
          <img
            src={product.imageUrl || "/placeholder.jpg"}
            alt={product.name}
          />

          <div className="card-content">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price}</p>
            <p className="muted">
              {product.restaurant?.name}
            </p>
            <p className="muted">
              {product.category?.name}
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
      ))}
    </div>
  </div>
);
}
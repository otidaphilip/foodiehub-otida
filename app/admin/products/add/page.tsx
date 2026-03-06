"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants { id name }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    categories { id name }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddProduct($input: AddProductInput!) {
    addProduct(input: $input) { id name }
  }
`;

interface Restaurant { id: string; name: string }
interface Category { id: string; name: string }

interface GetRestaurantsData { restaurants: Restaurant[] }
interface GetCategoriesData { categories: Category[] }

export default function AddProduct() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const { data: restData } = useQuery<GetRestaurantsData>(GET_RESTAURANTS);
  const { data: catData } = useQuery<GetCategoriesData>(GET_CATEGORIES);

  const [addProduct, { loading, error }] = useMutation(ADD_PRODUCT, {
    onCompleted: () => router.push("/admin/products"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addProduct({
      variables: {
        input: {
          name,
          price: Number(price),
          description,
          imageUrl,
          restaurantId,
          categoryId,
        },
      },
    });
  };

  return (
   <div className="container center">
    {/* Back Button */}
    <button className="admin-back-orange" onClick={() => router.push("/admin/products")}>
      ← Back
    </button>

      <div className="form-section">

        <h1 className="page-title">Add Product</h1>

        {error && (
          <div className="error-message">{error.message}</div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>

          <div className="form-row">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-row">
            <label>Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>

          <div className="form-row">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="form-row">
            <label>Image URL</label>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>

          <div className="form-row">
            <label>Restaurant</label>
            <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)} required>
              <option value="">Select Restaurant</option>
              {restData?.restaurants.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">Select Category</option>
              {catData?.categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button className="admin-add" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </button>

        </form>
      </div>
    </div>
  );
}
"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// ------------------ GraphQL Queries & Mutation ------------------ //
const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      price
      description
      imageUrl
      restaurant { id name }
      category { id name }
    }
  }
`;

const GET_RESTAURANTS = gql`
  query {
    restaurants { id name }
  }
`;

const GET_CATEGORIES = gql`
  query {
    categories { id name }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddProduct($input: AddProductInput!) {
    addProduct(input: $input) {
      id
      name
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

// ------------------ TypeScript Interfaces ------------------ //
interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  restaurant?: { id: string; name: string };
  category?: { id: string; name: string };
}

interface ProductData {
  product: Product;
}

interface RestaurantsData {
  restaurants: { id: string; name: string }[];
}

interface CategoriesData {
  categories: { id: string; name: string }[];
}

interface AddProductInput {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  restaurantId: string;
  categoryId: string;
}

// ------------------ Component ------------------ //
export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  // Fetch product, restaurants & categories
  const { data: productData, loading: productLoading } = useQuery<ProductData>(GET_PRODUCT, { variables: { id } });
  const { data: restData } = useQuery<RestaurantsData>(GET_RESTAURANTS);
  const { data: catData } = useQuery<CategoriesData>(GET_CATEGORIES);

  // Form state
  const [form, setForm] = useState<AddProductInput>({
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    restaurantId: "",
    categoryId: "",
  });

  // Mutations
  const [addProduct, { loading: adding, error: addError }] = useMutation(ADD_PRODUCT, {
    onCompleted: () => router.push("/admin/products"),
  });
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  // Pre-fill form
  useEffect(() => {
    if (productData?.product) {
      const p = productData.product;
      setForm({
        name: p.name,
        price: p.price,
        description: p.description || "",
        imageUrl: p.imageUrl || "",
        restaurantId: p.restaurant?.id || "",
        categoryId: p.category?.id || "",
      });
    }
  }, [productData]);

  if (productLoading) return <p>Loading product...</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.name === "price" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Delete old product first
    await deleteProduct({ variables: { id } });

    // Add new product with updated data
    await addProduct({
      variables: { input: form },
    });
  };

  return (
    <div className="container">
      <h1>Edit Product</h1>

      {addError && <p style={{ color: "red" }}>Failed to update: {addError.message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name:
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>Price:
          <input type="number" name="price" value={form.price} onChange={handleChange} required />
        </label>

        <label>Description:
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>

        <label>Image URL:
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        </label>

        <label>Restaurant:
          <select name="restaurantId" value={form.restaurantId} onChange={handleChange} required>
            <option value="">Select Restaurant</option>
            {restData?.restaurants.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </label>

        <label>Category:
          <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
            <option value="">Select Category</option>
            {catData?.categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={adding}>
          {adding ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
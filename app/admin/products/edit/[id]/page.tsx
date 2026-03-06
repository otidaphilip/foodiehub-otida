"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// ------------------ GraphQL ------------------ //

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

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
    }
  }
`;


// ------------------ Types ------------------ //

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

interface UpdateProductInput {
  id: string;
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

  const { data: productData, loading: productLoading } =
    useQuery<ProductData>(GET_PRODUCT, {
      variables: { id },
    });

  const { data: restData } = useQuery<RestaurantsData>(GET_RESTAURANTS);
  const { data: catData } = useQuery<CategoriesData>(GET_CATEGORIES);

  const [form, setForm] = useState<UpdateProductInput>({
    id: "",
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    restaurantId: "",
    categoryId: "",
  });


  const [updateProduct, { loading: updating, error }] = useMutation(
    UPDATE_PRODUCT,
    {
      refetchQueries: ["GetProducts"], // refresh product list
      onCompleted: () => {
        router.push("/admin/products");
      },
    }
  );


  // Prefill form
  useEffect(() => {

    if (productData?.product) {

      const p = productData.product;

      setForm({
        id: p.id,
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


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {

    const value =
      e.target.name === "price"
        ? Number(e.target.value)
        : e.target.value;

    setForm({
      ...form,
      [e.target.name]: value,
    });

  };


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    await updateProduct({
      variables: {
        input: form,
      },
    });

  };


  return (
    <div className="container center">

      {/* Back Button */}
      <button
        className="admin-back-orange"
        onClick={() => router.push("/admin/products")}
      >
        ← Back
      </button>


      <div className="form-section">

        <h1 className="page-title">Edit Product</h1>

        {error && (
          <p className="error-message">
            Failed to update: {error.message}
          </p>
        )}


        <form className="admin-form" onSubmit={handleSubmit}>

          <div className="form-row">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-row">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-row">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>


          <div className="form-row">
            <label>Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>


          <div className="form-row">
            <label>Restaurant</label>

            <select
              name="restaurantId"
              value={form.restaurantId}
              onChange={handleChange}
              required
            >
              <option value="">Select Restaurant</option>

              {restData?.restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}

            </select>
          </div>


          <div className="form-row">
            <label>Category</label>

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>

              {catData?.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}

            </select>
          </div>


          <button
            type="submit"
            className="admin-add"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Product"}
          </button>

        </form>
      </div>
    </div>
  );
}
"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";

const GET_CATEGORY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      id
      name
    }
  }
`;

type Category = {
  id: number;
  name: string;
};

type GetCategoryData = {
  category: Category;
};

export default function ViewCategory() {
  const { id } = useParams();
  const router = useRouter();

  const { data, loading } = useQuery<GetCategoryData>(GET_CATEGORY, {
    variables: { id: Number(id) },
  });

  if (loading) return <p className="container">Loading...</p>;
  if (!data) return <p className="container">No data found</p>;

  return (
    <div className="container">

      {/* Back Button */}
      <button
        className="admin-back back-btn"
        onClick={() => router.push("/admin/categories")}
      >
        ← Back
      </button>

      {/* Centered View Card */}
      <div className="view-product-wrapper">
        <div className="view-product-card">

          {/* RIGHT SIDE CONTENT (no image) */}
          <div className="view-product-right" style={{ width: "100%" }}>

            <div className="product-id">
              CATEGORY ID: {data.category.id}
            </div>

            <h2 className="product-name">
              {data.category.name}
            </h2>

            <p className="product-description">
              This category is used to organize food items in the system.
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}
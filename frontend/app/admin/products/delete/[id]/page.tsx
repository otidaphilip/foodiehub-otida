"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export default function DeleteProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [deleteProduct, { loading, error }] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => router.push("/admin/products"),
  });

  useEffect(() => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct({ variables: { id } });
    } else {
      router.push("/admin/products");
    }
  }, [id]);

  if (loading) return <p>Deleting product...</p>;
  if (error) return <p>Error deleting product.</p>;

  return null;
}
"use client";

import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="container">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="muted">
            Manage products, restaurants, and categories from here.
          </p>
        </div>

        <button
          className="button"
          onClick={() => router.push("/")}
        >
          ← Back to Home
        </button>
      </div>

      {/* Admin Cards */}
      <div className="admin-grid">

        <div
          className="admin-card"
          onClick={() => router.push("/admin/products")}
        >
          <div className="admin-card-icon">📦</div>
          <div>
            <h3>Manage Products</h3>
            <p className="muted">
              Add, edit, delete and view all products.
            </p>
          </div>
        </div>

        <div
          className="admin-card"
          onClick={() => router.push("/admin/restaurants")}
        >
          <div className="admin-card-icon">🏬</div>
          <div>
            <h3>Manage Restaurants</h3>
            <p className="muted">
              Control restaurant listings and details.
            </p>
          </div>
        </div>

        <div
          className="admin-card"
          onClick={() => router.push("/admin/categories")}
        >
          <div className="admin-card-icon">📂</div>
          <div>
            <h3>Manage Categories</h3>
            <p className="muted">
              Organize product categories efficiently.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
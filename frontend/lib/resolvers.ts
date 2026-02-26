import db from "./db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

const resolvers = {
  Query: {
    // =========================
    // PRODUCTS
    // =========================
    products: async () => {
      try {
        const [rows] = await db.query("SELECT * FROM products");
        return rows;
      } catch (error) {
        console.error("REAL DB ERROR:", error);
        throw error;
      }
    },

    product: async (
      _: unknown,
      { id }: { id: number }
    ): Promise<RowDataPacket | null> => {
      try {
        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT * FROM products WHERE id = ?",
          [Number(id)]
        );
        return rows[0] || null;
      } catch (error) {
        console.error("Error fetching product:", error);
        throw new Error("Failed to fetch product");
      }
    },

    // =========================
    // RESTAURANTS
    // =========================
    restaurants: async (): Promise<RowDataPacket[]> => {
      try {
        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT * FROM restaurants"
        );
        return rows;
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        throw new Error("Failed to fetch restaurants");
      }
    },

    restaurant: async (
      _: unknown,
      { id }: { id: number }
    ): Promise<RowDataPacket | null> => {
      try {
        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT * FROM restaurants WHERE id = ?",
          [Number(id)]
        );
        return rows[0] || null;
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        throw new Error("Failed to fetch restaurant");
      }
    },

    // =========================
    // CATEGORIES
    // =========================
    categories: async (): Promise<RowDataPacket[]> => {
      try {
        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT * FROM categories"
        );
        return rows;
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories");
      }
    },

    category: async (
      _: unknown,
      { id }: { id: number }
    ): Promise<RowDataPacket | null> => {
      try {
        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT * FROM categories WHERE id = ?",
          [Number(id)]
        );
        return rows[0] || null;
      } catch (error) {
        console.error("Error fetching category:", error);
        throw new Error("Failed to fetch category");
      }
    },

    // =========================
    // SEARCH PRODUCTS
    // =========================
    searchProducts: async (
      _: unknown,
      { input }: { input?: any }
    ): Promise<RowDataPacket[]> => {
      try {
        let query = "SELECT * FROM products WHERE 1=1";
        const params: any[] = [];

        if (input?.searchTerm) {
          query += " AND name LIKE ?";
          params.push(`%${input.searchTerm}%`);
        }

        if (input?.categoryId) {
          query += " AND category_id = ?";
          params.push(Number(input.categoryId));
        }

        if (input?.restaurantId) {
          query += " AND restaurant_id = ?";
          params.push(Number(input.restaurantId));
        }

        if (input?.minPrice !== undefined) {
          query += " AND price >= ?";
          params.push(Number(input.minPrice));
        }

        if (input?.maxPrice !== undefined) {
          query += " AND price <= ?";
          params.push(Number(input.maxPrice));
        }

        const [rows] = await db.query<RowDataPacket[]>(query, params);
        return rows;
      } catch (error) {
        console.error("Error searching products:", error);
        throw new Error("Failed to search products");
      }
    },
  },

  // =========================
  // MUTATIONS
  // =========================
  Mutation: {
    // RESTAURANT
    addRestaurant: async (_: unknown, { input }: { input: any }) => {
      const { name, location, description, imageUrl } = input;

      const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO restaurants (name, location, description, image_url)
         VALUES (?, ?, ?, ?)`,
        [name, location, description, imageUrl]
      );

      return {
        id: result.insertId,
        ...input,
      };
    },

    updateRestaurant: async (_: unknown, { input }: { input: any }) => {
      const { id, name, location, description, imageUrl } = input;

      await db.query(
        `UPDATE restaurants
         SET name = COALESCE(?, name),
             location = COALESCE(?, location),
             description = COALESCE(?, description),
             image_url = COALESCE(?, image_url)
         WHERE id = ?`,
        [name, location, description, imageUrl, Number(id)]
      );

      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM restaurants WHERE id = ?",
        [Number(id)]
      );

      return rows[0] || null;
    },

    deleteRestaurant: async (_: unknown, { id }: { id: number }) => {
      await db.query("DELETE FROM restaurants WHERE id = ?", [Number(id)]);
      return true;
    },

    // CATEGORY
    addCategory: async (_: unknown, { input }: { input: any }) => {
      const [result] = await db.query<ResultSetHeader>(
        "INSERT INTO categories (name) VALUES (?)",
        [input.name]
      );

      return {
        id: result.insertId,
        name: input.name,
      };
    },

    updateCategory: async (_: unknown, { input }: { input: any }) => {
      await db.query(
        "UPDATE categories SET name = COALESCE(?, name) WHERE id = ?",
        [input.name, Number(input.id)]
      );

      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM categories WHERE id = ?",
        [Number(input.id)]
      );

      return rows[0] || null;
    },

    deleteCategory: async (_: unknown, { id }: { id: number }) => {
      await db.query("DELETE FROM categories WHERE id = ?", [Number(id)]);
      return true;
    },

    // PRODUCT
    addProduct: async (_: unknown, { input }: { input: any }) => {
      const {
        name,
        price,
        restaurantId,
        categoryId,
        description,
        imageUrl,
      } = input;

      const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO products
         (name, price, restaurant_id, category_id, description, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, price, restaurantId, categoryId, description, imageUrl]
      );

      return {
        id: result.insertId,
        ...input,
      };
    },

    updateProduct: async (_: unknown, { input }: { input: any }) => {
      const {
        id,
        name,
        price,
        restaurantId,
        categoryId,
        description,
        imageUrl,
      } = input;

      await db.query(
        `UPDATE products
         SET name = COALESCE(?, name),
             price = COALESCE(?, price),
             restaurant_id = COALESCE(?, restaurant_id),
             category_id = COALESCE(?, category_id),
             description = COALESCE(?, description),
             image_url = COALESCE(?, image_url)
         WHERE id = ?`,
        [
          name,
          price,
          restaurantId,
          categoryId,
          description,
          imageUrl,
          Number(id),
        ]
      );

      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM products WHERE id = ?",
        [Number(id)]
      );

      return rows[0] || null;
    },

    deleteProduct: async (_: unknown, { id }: { id: number }) => {
      await db.query("DELETE FROM products WHERE id = ?", [Number(id)]);
      return true;
    },
  },

  // =========================
  // RELATIONSHIPS
  // =========================
  Product: {
    restaurant: async (parent: any) => {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM restaurants WHERE id = ?",
        [Number(parent.restaurant_id)]
      );
      return rows[0] || null;
    },

    category: async (parent: any) => {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM categories WHERE id = ?",
        [Number(parent.category_id)]
      );
      return rows[0] || null;
    },
  },

  Restaurant: {
    products: async (parent: any) => {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM products WHERE restaurant_id = ?",
        [Number(parent.id)]
      );
      return rows;
    },
  },
};

export default resolvers;
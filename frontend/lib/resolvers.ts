import db from "./db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

const resolvers = {
  Query: {
    products: async () => {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM products"
      );
      return rows;
    },

    restaurants: async () => {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM restaurants"
      );
      return rows;
    },

    categories: async () => {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM categories"
      );
      return rows;
    },

    product: async (_: any, { id }: { id: number }) => {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM products WHERE id = ?",
        [id]
      );
      return rows[0] || null;
    },

    restaurant: async (_: any, { id }: { id: number }) => {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM restaurants WHERE id = ?",
        [id]
      );
      return rows[0] || null;
    },

    searchProducts: async (_: any, { input }: { input?: any }) => {
      let query = "SELECT * FROM products WHERE 1=1";
      const params: any[] = [];

      if (input?.searchTerm) {
        query += " AND name LIKE ?";
        params.push(`%${input.searchTerm}%`);
      }

      if (input?.categoryId) {
        query += " AND category_id = ?";
        params.push(input.categoryId);
      }

      if (input?.restaurantId) {
        query += " AND restaurant_id = ?";
        params.push(input.restaurantId);
      }

      if (input?.minPrice) {
        query += " AND price >= ?";
        params.push(input.minPrice);
      }

      if (input?.maxPrice) {
        query += " AND price <= ?";
        params.push(input.maxPrice);
      }

      const [rows] = await db.query<RowDataPacket[]>(query, params);
      return rows;
    },
  },

  Mutation: {
    addRestaurant: async (_: any, { input }: { input: any }) => {
      const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO restaurants (name, location, description)
         VALUES (?, ?, ?)`,
        [input.name, input.location, input.description]
      );

      return {
        id: result.insertId,
        ...input,
      };
    },

    updateRestaurant: async (_: any, { input }: { input: any }) => {
      await db.query(
        `UPDATE restaurants SET name=?, location=?, description=? WHERE id=?`,
        [input.name, input.location, input.description, input.id]
      );

      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM restaurants WHERE id = ?",
        [input.id]
      );

      return rows[0];
    },

    addProduct: async (_: any, { input }: { input: any }) => {
      const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO products
         (name, price, restaurant_id, category_id, description, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          input.name,
          input.price,
          input.restaurantId,
          input.categoryId,
          input.description,
          input.imageUrl,
        ]
      );

      return {
        id: result.insertId,
        ...input,
      };
    },

    deleteProduct: async (_: any, { id }: { id: number }) => {
      await db.query("DELETE FROM products WHERE id = ?", [id]);
      return true;
    },
  },

  Product: {
    restaurant: async (parent: any) => {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM restaurants WHERE id = ?",
        [parent.restaurant_id]
      );
      return rows[0] || null;
    },

    category: async (parent: any) => {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM categories WHERE id = ?",
        [parent.category_id]
      );
      return rows[0] || null;
    },

    imageUrl: (parent: any) => parent.image_url,
  },

  Restaurant: {
    products: async (parent: any) => {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM products WHERE restaurant_id = ?",
        [parent.id]
      );
      return rows;
    },

    imageUrl: (parent: any) => parent.image_url,
  },
};

export default resolvers;
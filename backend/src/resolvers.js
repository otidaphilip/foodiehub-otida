const db = require("./db");

const resolvers = {
  // -------------------------
  // QUERIES
  // -------------------------

  Query: {
    products: async () => {
      const [rows] = await db.query("SELECT * FROM products");
      return rows;
    },

    restaurants: async () => {
      const [rows] = await db.query("SELECT * FROM restaurants");
      return rows;
    },

    categories: async () => {
      const [rows] = await db.query("SELECT * FROM categories");
      return rows;
    },

    product: async (_, { id }) => {
      const [rows] = await db.query(
        "SELECT * FROM products WHERE id = ?",
        [id]
      );
      return rows[0];
    },

    restaurant: async (_, { id }) => {
      const [rows] = await db.query(
        "SELECT * FROM restaurants WHERE id = ?",
        [id]
      );
      return rows[0];
    },

    category: async (_, { id }) => {
      const [rows] = await db.query(
        "SELECT * FROM categories WHERE id = ?",
        [id]
      );
      return rows[0];
    },

    searchProducts: async (_, { input }) => {
      let query = "SELECT * FROM products WHERE 1=1";
      const params = [];

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

      if (input?.minPrice !== undefined) {
        query += " AND price >= ?";
        params.push(input.minPrice);
      }

      if (input?.maxPrice !== undefined) {
        query += " AND price <= ?";
        params.push(input.maxPrice);
      }

      const [rows] = await db.query(query, params);
      return rows;
    },
  },

  // -------------------------
  // MUTATIONS
  // -------------------------

  Mutation: {

    // -------- Restaurant --------

    addRestaurant: async (_, { input }) => {
      const { name, location, description, imageUrl } = input;

      const [result] = await db.query(
        `INSERT INTO restaurants (name, location, description, image_url)
         VALUES (?, ?, ?, ?)`,
        [name, location, description, imageUrl]
      );

      return {
        id: result.insertId,
        ...input,
      };
    },

    updateRestaurant: async (_, { input }) => {
      const { id, name, location, description, imageUrl } = input;

      await db.query(
        `UPDATE restaurants
         SET name = COALESCE(?, name),
             location = COALESCE(?, location),
             description = COALESCE(?, description),
             image_url = COALESCE(?, image_url)
         WHERE id = ?`,
        [name, location, description, imageUrl, id]
      );

      const [rows] = await db.query(
        "SELECT * FROM restaurants WHERE id = ?",
        [id]
      );

      return rows[0];
    },

    deleteRestaurant: async (_, { id }) => {
      await db.query("DELETE FROM restaurants WHERE id = ?", [id]);
      return true;
    },

    // -------- Category --------

    addCategory: async (_, { input }) => {
      const { name } = input;

      const [result] = await db.query(
        "INSERT INTO categories (name) VALUES (?)",
        [name]
      );

      return {
        id: result.insertId,
        name,
      };
    },

    updateCategory: async (_, { input }) => {
      const { id, name } = input;

      await db.query(
        "UPDATE categories SET name = COALESCE(?, name) WHERE id = ?",
        [name, id]
      );

      const [rows] = await db.query(
        "SELECT * FROM categories WHERE id = ?",
        [id]
      );

      return rows[0];
    },

    deleteCategory: async (_, { id }) => {
      await db.query("DELETE FROM categories WHERE id = ?", [id]);
      return true;
    },

    // -------- Product --------

    addProduct: async (_, { input }) => {
      const {
        name,
        price,
        restaurantId,
        categoryId,
        description,
        imageUrl,
      } = input;

      const [result] = await db.query(
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

    updateProduct: async (_, { input }) => {
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
          id,
        ]
      );

      const [rows] = await db.query(
        "SELECT * FROM products WHERE id = ?",
        [id]
      );

      return rows[0];
    },

    deleteProduct: async (_, { id }) => {
      await db.query("DELETE FROM products WHERE id = ?", [id]);
      return true;
    },
  },

  // -------------------------
  // RELATIONAL RESOLVERS
  // -------------------------

  Product: {
    restaurant: async (parent) => {
      const [rows] = await db.query(
        "SELECT * FROM restaurants WHERE id = ?",
        [parent.restaurant_id]
      );
      return rows[0];
    },

    category: async (parent) => {
      const [rows] = await db.query(
        "SELECT * FROM categories WHERE id = ?",
        [parent.category_id]
      );
      return rows[0];
    },
  },

  Restaurant: {
    products: async (parent) => {
      const [rows] = await db.query(
        "SELECT * FROM products WHERE restaurant_id = ?",
        [parent.id]
      );
      return rows;
    },
  },
};

module.exports = resolvers;
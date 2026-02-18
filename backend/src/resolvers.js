const db = require("./db");

const resolvers = {
  Query: {
    products: async () => {
      const [rows] = await db.query("SELECT * FROM products");
      return rows;
    },

    restaurants: async () => {
      const [rows] = await db.query("SELECT * FROM restaurants");
      return rows;
    },
  },
};

module.exports = resolvers;

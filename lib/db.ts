import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
  },
});

db.getConnection()
  .then(() => console.log("✅ MySQL Connected"))
  .catch((err) => console.error("❌ MySQL Connection Failed:", err));
  
export default db;
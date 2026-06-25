import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

//Using the dot env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

//Check for connection is built
async function verifyConnection() {
  try {
    //Attempt to acquire a client from the pool

    const client = await pool.connect();
    console.log("Connected to PostgreSQL database");
    client.release(); //release the fetched client back to pool
  } catch (error) {
    console.error("Error conecting to database", error);
  }
}

//Now to verify connection upon module loading
verifyConnection();

export default pool;

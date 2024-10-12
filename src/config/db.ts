import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), // Convert to number
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const connectDb = async () => {
    try {
        await pool.connect();
        console.log('Connected to database');
    } catch (error) {
        console.error('Error connecting to database', error);
    }
};

export { connectDb };
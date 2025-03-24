import mysql from 'mysql2'
import dotenv from "dotenv";


dotenv.config();

export const pool = mysql.createPool({
    host: process.env.BD_HOST, 
    user: process.env.DB_USER,            
    password: process.env.DB_PASSWORD,           
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT
});
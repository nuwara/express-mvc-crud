import db from "../config/db.js";

export default async function dbSetup(){
    await db.query("CREATE DATABASE IF NOT EXISTS mvc_test");
    await db.query("USE mvc_test");
    await db.query(`CREATE TABLE IF NOT EXISTS products(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        description TEXT,
        quantity VARCHAR(100),
        price VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    );
}
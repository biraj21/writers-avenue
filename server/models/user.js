import bcrypt from "bcrypt";
import dbPool from "../util/database.js";

export default class User {
  static async create({ name, email, imageUrl, password }) {
    let conn;
    try {
      conn = await dbPool.getConnection();

      const hashedPassword = await bcrypt.hash(password, 12);
      return await conn.query("INSERT INTO `User` (`name`, `email`, `imageUrl`, `password`) VALUES (?, ?, ?, ?)", [
        name,
        email,
        imageUrl,
        hashedPassword,
      ]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getByEmail(email) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return (await conn.query("SELECT * FROM `User` WHERE `email` = ?", [email]))[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getById(id) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return (await conn.query("SELECT * FROM `User` WHERE `id` = ?", [id]))[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

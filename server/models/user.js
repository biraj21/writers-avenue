import bcrypt from "bcrypt";
import dbPool from "../util/database.js";

export default class User {
  static async create({ name, email, password, avatarPath }) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const hashedPassword = await bcrypt.hash(password, 12);
      const query = "INSERT INTO `User` (`name`, `email`, `password`, `avatarPath`) VALUES (?, ?, ?, ?)";
      return await conn.query(query, [name, email, hashedPassword, avatarPath]);
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
      const query = "SELECT * FROM `User` WHERE `email` = ?";
      return (await conn.query(query, [email]))[0];
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
      const query = "SELECT * FROM `User` WHERE `id` = ?";
      return (await conn.query(query, [id]))[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

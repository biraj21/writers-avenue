import bcrypt from "bcrypt";
import dbPool from "../util/database.js";

import { IUser } from "../types/user/index.js";

export default class User {
  static async create(user: Partial<IUser>) {
    const { name, email, password, avatarPath, authMethod } = user;

    let conn;
    try {
      conn = await dbPool.getConnection();
      const hashedPassword = null;
      if (password) {
        await bcrypt.hash(password, 12);
      }

      const query = "INSERT INTO `User` (name, email, password, avatarPath, authMethod) VALUES (?, ?, ?, ?, ?)";
      return await conn.query(query, [name, email, hashedPassword, avatarPath, authMethod]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getByEmail(email: string) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = "SELECT * FROM `User` WHERE email = ?";
      return (await conn.query(query, [email]))[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getById(id: number) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = "SELECT * FROM `User` WHERE id = ?";
      return (await conn.query(query, [id]))[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async updateById(update: Partial<IUser>, id: number) {
    const { name, avatarPath } = update;

    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = "UPDATE `User` SET name = ?, avatarPath = ? WHERE id = ?";
      return (await conn.query(query, [name, avatarPath, id]))[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

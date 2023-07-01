import dbPool from "../util/database.js";

import { IPostChanges } from "../types/post-changes/index.js";

export default class PostChanges {
  static async create(changes: Partial<IPostChanges>) {
    const { title, body = null, coverPath = null, category = null, postId, userId } = changes;

    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = "INSERT INTO PostChanges VALUES (?, ?, ?, ?, ?, ?)";
      return await conn.query(query, [title, body, coverPath, category, postId, userId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getOneByIds(postId: number, userId: number) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = "SELECT * FROM PostChanges WHERE postId = ? AND userId = ?";
      return (await conn.query(query, [postId, userId]))[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getOneXByPostId(columns: string[], postId: number) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = `SELECT ${columns.join(",")} FROM PostChanges WHERE postId = ?`;
      return (await conn.query(query, postId))[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async update(update: Partial<IPostChanges>) {
    const { title, body = null, coverPath = null, category = null, postId, userId } = update;

    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = `
        UPDATE PostChanges SET
          title = ?,
          body = ?,
          coverPath = ?,
          category = ?
        WHERE postId = ? AND userId = ?`;
      return await conn.query(query, [title, body, coverPath, category, postId, userId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async delete(postId: number, userId: number) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = "DELETE FROM PostChanges WHERE postId = ? AND userId = ?";
      return await conn.query(query, [postId, userId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

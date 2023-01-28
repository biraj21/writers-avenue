import dbPool from "../util/database.js";

export default class Comment {
  static async create() {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = "";
      return await conn.query(query, []);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getAllByPostId(postId) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = "";
      return await conn.query(query, [postId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async delete() {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = "";
      return await conn.query(query, []);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

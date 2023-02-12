import dbPool from "../util/database.js";

export default class PostChanges {
  static async create({ title, body = null, coverPath = null, category = null, postId, userId }) {
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

  static async getOneByIds(postId, userId) {
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

  static async getOneXByPostId(columns, postId) {
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

  static async update({ title, body = null, coverPath = null, category = null, postId, userId }) {
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

  static async delete(postId, userId) {
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

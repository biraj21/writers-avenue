import dbPool from "../util/database.js";

export default class Comment {
  static async create({ body, postId, userId }) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = "INSERT INTO Comment (body, postId, userId) VALUES (?, ?, ?)";
      return await conn.query(query, [body, postId, userId]);
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
      const query = `SELECT
        c.id,
        c.body,
        c.postId,
        c.date,
        u.id userId,
        u.name userName,
        u.avatarPath userAvatarPath
      FROM Comment c
      JOIN User u
      ON c.userId = u.id
      WHERE c.postId = ?`;
      return await conn.query(query, [postId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async delete(id, userId) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = "DELETE FROM Comment WHERE id = ? AND userId = ?";
      return await conn.query(query, [id, userId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

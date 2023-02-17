import dbPool from "../util/database.js";

export default class Like {
  static async create({ postId, userId }) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return conn.query("INSERT INTO `Like` (postId, userId) VALUES (?, ?)", [postId, userId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getCountByPostId(postId) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return (await conn.query("SELECT COUNT(liked) FROM `Like` WHERE postId = ? AND liked = 1", [postId]))[0][
        "COUNT(liked)"
      ];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getOne(postId, userId) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return (await conn.query("SELECT liked FROM `Like` WHERE postId = ? AND userId = ?", [postId, userId]))[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async update({ liked, postId, userId }) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return (
        await conn.query("UPDATE `Like` SET liked = ? WHERE postId = ? AND userId =?", [liked, postId, userId])
      )[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

import dbPool from "../util/database.js";

export default class Post {
  static async create({
    title,
    body = null,
    coverPath = null,
    category = null,
    publishDate = new Date(),
    status = "pub",
    userId,
  }) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query =
        "INSERT INTO Post (title, body, coverPath, category, publishDate, status, userId) VALUES (?, ?, ?, ?, ?, ?, ?)";
      return await conn.query(query, [title, body, coverPath, category, publishDate, status, userId]);
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
      const query = "DELETE FROM Post WHERE id = ? AND userId = ?";
      return await conn.query(query, [id, userId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getAll(status = "pub") {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = `SELECT
        p.*,
        u.name userName,
        u.avatarPath userAvatarPath,
        u.authMethod userAuthMethod
      FROM Post p JOIN User u
      ON p.userId = u.id
      WHERE p.status = ?`;
      return await conn.query(query, [status]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getByCategory(category, status = "pub") {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = `SELECT
        p.*,
        u.name userName,
        u.avatarPath userAvatarPath,
        u.authMethod userAuthMethod
      FROM Post p JOIN User u
      ON p.userId = u.id
      WHERE p.category = ? AND p.status = ?`;
      return await conn.query(query, [category, status]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  /** will be used when a user's profile is visited so not joining the user table */
  static async getByUserId(userId, status = "pub") {
    let conn;
    try {
      conn = await dbPool.getConnection();
      let query;
      if (status !== "*") {
        query = "SELECT * FROM Post WHERE userId = ? AND status = ?";
        return await conn.query(query, [userId, status]);
      } else {
        query = "SELECT * FROM Post WHERE userId = ?";
        return await conn.query(query, [userId]);
      }
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getOneById(id) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = `
      SELECT
        p.*,
        u.name userName,
        u.avatarPath userAvatarPath,
        u.authMethod userAuthMethod
      FROM Post p JOIN User u
      ON p.userId = u.id
      WHERE p.id = ?`;
      return (await conn.query(query, [id]))[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getOneXById(columns, id) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = `SELECT ${columns.join(",")} FROM Post WHERE id = ?`;
      return (await conn.query(query, id))[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  /** update will be done based on both post id & logged in user's id */
  static async update({ title, body, coverPath, category, publishDate, status = "pub" }, id, userId) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      let query = `        
        UPDATE Post SET
          title = ?,
          body = ?,
          coverPath = ?,
          category = ?,
          ${publishDate ? "publishDate = ?," : ""}
          editDate = CURRENT_TIMESTAMP(),
          status = ?
        WHERE \`id\` = ? AND \`userId\` = ?`;

      let values;
      if (publishDate) {
        values = [title, body, coverPath, category, publishDate, status, id, userId];
      } else {
        values = [title, body, coverPath, category, status, id, userId];
      }

      return await conn.query(query, values);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

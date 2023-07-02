import dbPool from "../util/database.js";

import { IPost, PostCategory, PostStatus } from "../types/post/index.js";

export default class Post {
  static async create(post: Partial<IPost>) {
    const {
      title,
      body = null,
      coverPath = null,
      category = null,
      publishDate = new Date(),
      status = "pub",
      userId,
    } = post;

    let conn;
    try {
      conn = await dbPool.getConnection();
      const query =
        "INSERT INTO Post (title, body, coverPath, category, publishDate, status, userId) VALUES (?, ?, ?, ?, ?, ?, ?)";
      return await conn.query(query, [
        title,
        body,
        coverPath,
        category,
        publishDate ?? new Date(),
        status ?? "pub",
        userId,
      ]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async delete(id: number, userId: number) {
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

  static async getAll(options: { status?: PostStatus; category?: PostCategory; search?: string }) {
    const { status, category, search } = options;

    let conn;
    try {
      conn = await dbPool.getConnection();

      let query = `SELECT
        p.*,
        u.name userName,
        u.avatarPath userAvatarPath,
        u.authMethod userAuthMethod
      FROM Post p JOIN User u
      ON p.userId = u.id
      WHERE p.status = ?`;
      const values: string[] = [status ?? "pub"];

      if (category) {
        query += "\nAND p.category = ?";
        values.push(category);
      }

      if (search) {
        query += "\nAND p.title LIKE ?";
        values.push(`%${search.replace(/(_|%)/g, "\\$1")}%`);
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

  /** will be used when a user's profile is visited so not joining the user table */
  static async getByUserId(userId: number, status = "pub") {
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

  static async getOneById(id: number) {
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

  static async getOneXById(columns: string[], id: number) {
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
  static async update(update: Partial<IPost>, id: number, userId: number) {
    const { title, body, coverPath, category, publishDate = null, status = "pub" } = update;

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

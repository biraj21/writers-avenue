import dbPool from "../util/database.js";

export default class Post {
  static async create({ title, body, imageUrl, category, userId }) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return await conn.query(
        "INSERT INTO `Post` (`title`, `body`, `imageUrl`, `category`, `userId`) VALUES (?, ?, ?, ?, ?)",
        [title, body, imageUrl, category, userId]
      );
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async deleteByIdAndUser(id, userId) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return await conn.query("DELETE FROM Post WHERE id = ? AND userId = ?", [id, userId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async findAll() {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return await conn.query(`
SELECT
  p.id,
  p.title,
  p.body,
  p.imageUrl,
  p.category,
  p.uploadDate, 
  u.id authorId,
  u.name authorName,
  u.imageUrl authorAvatarUrl
FROM \`Post\` p JOIN \`User\` u
ON p.userId  = u.id`);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async findById(id) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = `
SELECT
  p.id,
  p.title,
  p.body,
  p.imageUrl,
  p.category,
  p.uploadDate, 
  u.id authorId,
  u.name authorName,
  u.imageUrl authorAvatarUrl
FROM \`Post\` p JOIN \`User\` u
ON p.userId = u.id AND p.id = ?`;
      return (await conn.query(query, [id]))[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async findByUserId(userId) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return await conn.query("SELECT `id`, `title`, `body`, `imageUrl` FROM Post WHERE `userId` = ?", [userId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async findSomeByCategory(category) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return await conn.query(
        `
SELECT
  p.id,
  p.title,
  p.body,
  p.imageUrl,
  p.category,
  p.uploadDate, 
  u.id authorId,
  u.name authorName,
  u.imageUrl authorAvatarUrl
FROM \`Post\` p JOIN \`User\` u
ON p.userId = u.id
WHERE category = ?`,
        [category]
      );
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async updateByIdAndUser({ id, title, body, imageUrl, category, userId }) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return await conn.query(
        `
UPDATE Post SET
  title = ?,
  body = ?,
  imageUrl = ?,
  category = ?
WHERE id = ? AND userId = ?`,
        [title, body, imageUrl, category, id, userId]
      );
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

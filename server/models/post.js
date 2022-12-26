import dbPool from "../util/database.js";

export default class Post {
  static async create(data) {
    let conn;
    try {
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

  static async findById(postId) {
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
      return (await conn.query(query, [postId]))[0];
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
}

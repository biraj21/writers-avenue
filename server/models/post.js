import dbPool from "../util/database.js";

export default class Post {
  static async create({ title, body, coverPath, category, userId }) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = "INSERT INTO `Post` (`title`, `body`, `coverPath`, `category`, `userId`) VALUES (?, ?, ?, ?, ?)";
      return await conn.query(query, [title, body, coverPath, category, userId]);
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
      const query = "DELETE FROM `Post` WHERE `id` = ? AND `userId` = ?";
      return await conn.query(query, [id, userId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getAll() {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = `
      SELECT
            p.*,
            u.name userName,
            u.avatarPath userAvatarPath
      FROM \`Post\` p JOIN \`User\` u
      ON p.userId = u.id`;
      return await conn.query(query);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getByCategory(category) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = `
      SELECT
        p.*,
        u.name userName,
        u.avatarPath userAvatarPath
      FROM \`Post\` p JOIN \`User\` u
      ON p.userId = u.id
      WHERE p.category = ?`;
      return await conn.query(query, [category]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getByUserId(userId) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = "SELECT `id`, `title`, `body`, `coverPath` FROM `Post` WHERE `userId` = ?";
      return await conn.query(query, [userId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getById(id) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      const query = `
      SELECT
        p.*,
        u.name userName,
        u.avatarPath userAvatarPath
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

  static async updateByIdAndUser({ id, title, body, coverPath, category, userId }) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      let query;
      if (coverPath) {
        query = `        
        UPDATE \`Post\` SET
          \`title\` = ?,
          \`body\` = ?,
          \`coverPath\` = ?,
          \`category\` = ?,
          \`private\` = FALSE,
          \`editDate\` = CURRENT_TIMESTAMP()
        WHERE \`id\` = ? AND \`userId\` = ?`;
        return await conn.query(query, [title, body, coverPath, category, id, userId]);
      }

      query = `        
        UPDATE \`Post\` SET
          \`title\` = ?,
          \`body\` = ?,
          \`category\` = ?,
          \`private\` = FALSE,
          \`editDate\` = CURRENT_TIMESTAMP()
        WHERE \`id\` = ? AND \`userId\` = ?`;
      return await conn.query(query, [title, body, category, id, userId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

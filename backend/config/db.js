const mysql = require("mysql2");

const dbConfigFromUrl = process.env.DATABASE_URL;

const db = dbConfigFromUrl
  ? mysql.createPool({
      uri: dbConfigFromUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "",
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false,
      },
    });

function testDbConnection() {
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
    } else {
      console.log("Connected to database (pool)");
      connection.release();
    }
  });
}

function printDbConfig() {
  if (dbConfigFromUrl) {
    try {
      const parsed = new URL(dbConfigFromUrl);
      console.log(
        `DB config -> host: ${parsed.hostname}, port: ${
          parsed.port || "3306"
        }, user: ${parsed.username || "(unknown)"}`
      );
    } catch (e) {
      console.log("DB config: using connection string");
    }
  }
}

module.exports = {
  db,
  testDbConnection,
  printDbConfig,
};
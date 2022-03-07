const { Pool } = require("pg");
const { credentials } = require("../util/credentials");

module.exports.pool = {
  createPool: () => new Pool(credentials.db),
//   query: async (pool, query) => await pool.query(query),
  endPool: async (pool) => await pool.end(),
};

module.exports = {
  now: async (connection) => await connection.query(`SELECT NOW()`),
  getAllTableData: async (connection, tableName) =>
    await connection.query(`SELECT * from ${tableName}`),
};

const { Client } = require("pg");
const { credentials } = require("../util/credentials");

module.exports.client = {
  createClient: () => new Client(credentials.db),
  connectClient: async (client) => await client.connect(),
//   query: async (client, query) => await client.query(query),
  endClient: async (client) => await client.end(),
};

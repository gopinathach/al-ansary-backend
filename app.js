const http = require("http").createServer(/* app */);
const io = require("socket.io")(
  http,
  {
    cors: true,
    origins: ["*", "http://127.0.0.1:3000", "http://localhost:3000"],
  } /* { cors: { origin: "*" } } */
);
const { Pool, Client } = require("pg");
const { server } = require("./util/server");
const { credentials } = require("./util/credentials");
const { pool } = require("./db/pool");
const { client } = require("./db/client");
const { now, getAllTableData } = require("./db/query");
const port = 4000;

// Connect with a connection pool.

async function poolDemo() {
  const lpool = pool.createPool();
  const nowRes = await now(lpool);
  const allDataRes = await getAllTableData(lpool, "messageQueue");
  console.log("allDataRes", allDataRes.rows);
  await pool.endPool(lpool);

  // return nowRes.rows[0]["now"];
  return allDataRes.rows;
}

// Connect with a client.

async function clientDemo() {
  const lclient = client.createClient();
  await client.connectClient(lclient);
  const nowRes = await now(lclient);
  await client.endClient(lclient);

  return nowRes.rows[0]["now"];
}

async function logOfNow() {
  const poolResult = await poolDemo();
  const clientResult = await clientDemo();

  console.log("Time with pool: " + poolResult);
  console.log("Time with client: " + clientResult);
}

io.on("connection", (socket) => {
  socket.on("message", ({ name, message }) => {
    console.log("{ name, message }", { name, message });
    io.emit("message", { name, message });
  });
  socket.on("chats", (chats) => {
    console.log("chats", chats);
    io.emit("chats", chats);
  });
  socket.on("receipt", async (stringValue) => {
    console.log("receipt", stringValue);
    const poolResult = await poolDemo();
    console.log("poolResult", poolResult);
    io.emit("receipt", poolResult);
  });
});

http.listen(4000, async function () {
  await logOfNow();
  console.log("listening on port 4000");
});

// server(http, port);

// const client = new Client({
//   user: "fgnmbpckyjybzk" /* "postgres" */,
//   host: "ec2-3-225-79-57.compute-1.amazonaws.com" /* "localhost" */,
//   database: "d26351tb6aan5r" /* "nodedemo" */,
//   password:
//     "862b164a6b8db41ea36a75786411f948c4e3e84b22ddcd7fe742c92f07adb6fb" /* "yourpassword" */,
//   port: 5432,
//   // connectionString:"postgres://fgnmbpckyjybzk:862b164a6b8db41ea36a75786411f948c4e3e84b22ddcd7fe742c92f07adb6fb@ec2-3-225-79-57.compute-1.amazonaws.com:5432/d26351tb6aan5r",
//   ssl: { rejectUnauthorized: false }
// });
// console.log("client", client);
// client.connect();

// client.query(`select * from company`, (err, res) => {
//   if (!err) {
//     console.log("res", res.rows);
//   } else {
//     console.log("err", err.message);
//   }
//   client.end;
// });

const http = require("http").createServer(
  /* app */ (req, res) => {
    let htmlFile = "";
    switch (req.url) {
      case "/":
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("Node.js says hello!"); //write a response to the client
        res.end();
        break;
      default:
        break;
    }
  }
);
const io = require("socket.io")(
  http,
  {
    cors: true,
    origins: ["*", "http://127.0.0.1:3000", "http://localhost:3000"],
    // allowEIO3: true,
    // transports: [
    //   "websocket",
    //   "flashsocket",
    //   "htmlfile",
    //   "xhr-polling",
    //   "jsonp-polling",
    // ],
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

http.listen(4000, async function () {
  await logOfNow();
  io.on("connection", (socket) => {
    socket.on("receipt", async (stringValue) => {
      console.log("receipt", stringValue);
      const poolResult = await poolDemo();
      console.log("poolResult", poolResult);
      io.emit("receipt", poolResult);
    });

    socket.on("disconnect", function () {
      console.log("Client disconnected.");
    });

    socket.on("close", function () {
      console.log("Client closed.");
    });
  });
  console.log("listening on port 4000");
});

// server(http, port);

///////////////////////////////////////////////
///////////// IMPORTS + VARIABLES /////////////
///////////////////////////////////////////////

const http = require("http");
const CONSTANTS = require("./utils/constants.js");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const { PORT, CLIENT, getTimeNow } = CONSTANTS;

///////////////////////////////////////////////
///////////// HTTP SERVER LOGIC ///////////////
///////////////////////////////////////////////

// Create the HTTP server
const server = http.createServer((req, res) => {
  const url = require("url");
  const parsedUrl = url.parse(req.url);
  const filePath =
    parsedUrl.pathname === "/" ? "/public/index.html" : parsedUrl.pathname;

  const extname = path.extname(filePath);
  let contentType = "text/html";
  if (extname === ".js") contentType = "text/javascript";
  else if (extname === ".css") contentType = "text/css";

  const fullPath = path.join(__dirname, filePath);

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 Not Found</h1>", "utf8");
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content, "utf8");
  });
});

///////////////////////////////////////////////
////////////////// WS LOGIC ///////////////////
///////////////////////////////////////////////

const wServer = new WebSocket.Server({ server });
wServer.on("connection", (socket) => {
  console.log("A new client has connected to the server!");

  socket.on("message", (data) => {
    console.log(data);

    const { type, payload } = JSON.parse(data);
    switch (type) {
      case CLIENT.MESSAGE.NEW_USER:
        broadcast(data, socket);
        break;
      case CLIENT.MESSAGE.NEW_MESSAGE:
        const current_time = getTimeNow();
        payload.time = current_time;
        const dataWithTime = {
          type: CLIENT.MESSAGE.NEW_MESSAGE,
          payload,
        };
        broadcast(JSON.stringify(dataWithTime), socket);
        break;
      default:
        break;
    }
  });
});

///////////////////////////////////////////////
////////////// HELPER FUNCTIONS ///////////////
///////////////////////////////////////////////

function broadcast(data, socketToOmit) {
  wServer.clients.forEach((connectedSocket) => {
    if (
      connectedSocket.readyState === WebSocket.OPEN &&
      connectedSocket !== socketToOmit
    ) {
      connectedSocket.send(data);
    }
  });
}

server.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});

const net = require("net");

const HOST = "127.0.0.1";
const PORT = 3009;

const server = net.createServer();

// array of client sockets
clients = [];

// with this chatapp, sockets acts as duplex stream for both reading and writing
server.on("connection", (socket) => {
  console.log("A new connection to the server!");

  const clientId = clients.length + 1;

  // broadcasting message to everyone when someone joins the chatroom
  clients.map((client) => {
    client.socket.write(`User ${clientId} joined`);
  });

  // sending id to the client
  socket.write(`id-${clientId}`);

  socket.on("data", (data) => {
    // decoding data before reading streams
    const dataString = data.toString("utf-8");

    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);

    clients.map((client) => {
      client.socket.write(`> User ${id}: ${message}`);
    });
  });

  // broadcasting message to everyone when someone leaves the chatroom
  socket.on("end", () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} left!`);
    });
  });

  clients.push({ id: clientId.toString(), socket: socket });
});

server.listen(PORT, HOST, () => {
  console.log("opened server on", server.address());
});

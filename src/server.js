const net = require("net");

// Server connection details
const HOST = "127.0.0.1";
const PORT = 3009;

// Create a TCP server
const server = net.createServer();

// Array to hold connected client sockets
let clients = [];

// Handle new client connections
// with this chatapp, sockets acts as duplex stream for both reading and writing
server.on("connection", (socket) => {
  console.log("A new connection to the server!");

  // Assign a unique ID to the new client
  const clientId = clients.length + 1;

  // Broadcast a message to all clients when someone joins the chatroom
  clients.forEach((client) => {
    client.socket.write(`User ${clientId} joined\n`);
  });

  // Send the client ID to the new client
  socket.write(`id-${clientId}`);

  // Handle incoming data from clients
  socket.on("data", (data) => {
    // Decode data before processing
    const dataString = data.toString("utf-8");

    // Extract the client ID and message from the received data
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);

    // Broadcast the message to all clients
    clients.forEach((client) => {
      client.socket.write(`> User ${id}: ${message}\n`);
    });
  });

  // Handle client disconnections
  socket.on("end", () => {
    // Remove the disconnected client from the clients array
    clients = clients.filter(client => client.socket !== socket);

    // Broadcast a message to all clients when someone leaves the chatroom
    clients.forEach((client) => {
      client.socket.write(`User ${clientId} left!\n`);
    });
  });

  // Add the new client to the clients array
  clients.push({ id: clientId.toString(), socket: socket });
});

// Start the server and listen for connections
server.listen(PORT, HOST, () => {
  console.log(`Server is listening on ${HOST}:${PORT}`);
});

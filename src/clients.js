const net = require("net");
const readline = require("readline/promises");

// Server connection details
const HOST = "127.0.0.1";
const PORT = 3009;

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Utility function to clear a line in the terminal
const clearLine = (dir) => {
  return new Promise((resolve) => {
    process.stdout.clearLine(dir, resolve);
  });
};

// Utility function to move the cursor in the terminal
const moveCursor = (dx, dy) => {
  return new Promise((resolve) => {
    process.stdout.moveCursor(dx, dy, resolve);
  });
};

// Variable to hold the client ID
let id;

// Create a TCP connection to the server
const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  console.log("Connected to the server");

  // Function to prompt user for a message and send it to the server
  const ask = async () => {
    const message = await rl.question("Enter a message > ");
    await moveCursor(0, -1);  // Move cursor one line up
    await clearLine(0);       // Clear the current line
    socket.write(`${id}-message-${message}`);
  };

  // Initial prompt for the user
  ask();

  // Handle incoming data from the server
  socket.on("data", async (data) => {
    console.log();
    await moveCursor(0, -1);  // Move cursor one line up
    await clearLine(0);       // Clear the current line

    const message = data.toString("utf-8");

    if (message.startsWith("id")) {
      // Extract and save client ID from server message
      id = message.substring(3);
      console.log(`Your id is ${id}!\n`);
    } else {
      // Display other messages from the server
      console.log(message);
    }

    // Prompt user for the next message
    ask();
  });
});

// Handle connection end event
socket.on("end", () => {
  console.log("Connection was ended by the server!");
});

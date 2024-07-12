const net = require("net");
const readline = require("readline/promises");

const HOST = "127.0.0.1";
const PORT = 3009;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

let id;

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  console.log("connected to the server");

  const ask = async () => {
    const message = await rl.question("Enter a message > ");
    //move cursor one line up
    await moveCursor(0, -1);
    // clear the current line with the cursor
    await clearLine(0);

    socket.write(`${id}-message-${message}`);
  };

  ask();

  socket.on("data", async (data) => {
    // log an empty line
    console.log();
    //move cursor one line up
    await moveCursor(0, -1);
    // clear the current line with the cursor
    await clearLine(0);

    if (data.toString().substring(0, 2) === "id") {
      // getting the id from the data header
      id = data.toString("utf-8").substring(3);

      console.log(`Your id is ${id}!\n `);
    } else {
      console.log(data.toString("utf-8"));
    }

    ask();
  });
});

socket.on("end", () => {
  console.log("connection was ended!");
});

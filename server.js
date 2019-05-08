const express = require("express");
const mongoose = require("mongoose");

// Initialize Express
const app = express();
var http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 5000;
import axios from "axios";

//Parse request body as a JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var db = require("./models");

// Connect to the mongoDb
mongoose.connect(
  "mongodb://heroku_gcgtf14g:qmsa1ecmde76ciish9m4osh24s@ds161295.mlab.com:61295/heroku_gcgtf14g",
  { useNewUrlParser: true }
);

const members = new Map();
let chatHistory = [];

require("./routes/apiRoutes")(app);

//sockets logic - TODO: make sure Matts latest code ends up here
let clients = {};
let users = {};

io.on("connection", client => {
  console.log("client connected...", client.id);
  clients[client.id] = client;

  client.on("join", (userId, room) => onJoin(userId, room, client));

  client.on("leave", (userId, room) => onLeave(userId, room, client));

  client.on("message", (msg, room) => onMessageReceived(msg, room, client));

  // client.on("disconnect", userId => onDisconnect(userId));

  client.on("error", function(err) {
    console.log("received error from client:", client.id);
    console.log(err);
  });
});

function onJoin(userId, room, client) {
  try {
    if (!userId) {
      // Todo: Code for unlogged user viewing local chat
      console.log("Not logged in.");
    } else {
      client.join(room);
      users[client.id] = userId;
      // _sendExistingMessages(client, room);
    }
  } catch (err) {
    console.err(err);
  }
}

function onMessageReceived(msg, room, senderClient) {
  // let userId = users[senderClient];
  let userId = "Sammy"
  console.log(msg, room)

  if (!userId) {
    console.log("Listening without user ID");
    return;
  }

  _sendAndSaveMessage(msg, room, senderClient);
}

function _sendExistingMessages(room, client) {
  // Will need to modify database path to math our structure
  let messages = db
    .collection("messages")
    .find(room)
    .sort({ createdAt: 1 })
    .toArray((err, messages) => {
      if (!messages.length) return;
      client.to(room).emit("message", messages.reverse);
    });
}

function _sendAndSaveMessage(msg, room, client, fromServer) {
  let messageData = {
    text: msg.text,
    user: msg.user,
    // createdAt: new Date(message.createdAt),
    chatName: room
  };
  console.log(messageData);
  let connString = "https://murmuring-sea-22252.herokuapp.com/message/" + room;
  axios.post(connString, messageData).then(res => {
    console.log(res);
  });

  // Will need to modify database path to math our structure
  db.collection("message").insert(messageData, (err, msg, room) => {
    // If the message is from the server, then send to everyone.
    let emitter = fromServer ? io : socket.to(room);
    emitter.emit("message", [msg]);
  });
}

// Allow the server to participate in the chatroom through stdin.
var stdin = process.openStdin();
stdin.addListener("data", function(d) {
  _sendAndSaveMessage(
    {
      text: d.toString().trim(),
      createdAt: new Date(),
      user: { _id: "robot" }
    },
    null /* no socket */,
    true /* send from server */
  );
});

//Start the server
http.listen(PORT, () => console.log(`App running on port ${PORT}!`));

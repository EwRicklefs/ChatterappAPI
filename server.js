const express = require("express");
const mongoose = require("mongoose");

// Initialize Express
const app = express();
var http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 3001;
const axios = require("axios");

//Parse request body as a JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var db = require("./models");

// Connect to the mongoDb
mongoose.connect("mongodb://heroku_gcgtf14g:qmsa1ecmde76ciish9m4osh24s@ds161295.mlab.com:61295/heroku_gcgtf14g", { useNewUrlParser: true });
// mongoose.connect(
//   process.env.MONGODB_URI || "mongodb://localhost/chatterlocaldb",
//   { useNewUrlParser: true }
// );

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
  console.log("Join hit");
  console.log("userId" + userId);
  console.log("room" + room);
  try {
    if (!userId) {
      // Todo: Code for unlogged user viewing local chat
      console.log("Not logged in.");
    } else {
      client.join(room);
      users[client.id] = userId;
      _sendExistingMessages(room, client);
    }
  } catch (err) {
    console.err(err);
  }
}

function onMessageReceived(msg, room, senderClient) {
  // let userId = users[senderClient];
  let userId = "Sammy";

  if (!userId) {
    console.log("Listening without user ID");
    return;
  }

  _sendAndSaveMessage(msg, room, senderClient);
}

function _sendExistingMessages(room, client) {
  // Will need to modify database path to math our structure
  // let connString = "https://murmuring-sea-22252.herokuapp.com/message/" + room;
  // let connString = "localhost:3001/message/" + room;

  // axios.get(connString).then(res => {
  //   console.log(res);
  //   client.to(room).emit("message", res.reverse);
  // });

  // let messages = db
  //   .collection("Message")
  //   .find(room)
  //   .sort({ createdAt: 1 })
  //   .toArray((err, messages) => {
  //     if (!messages.length) return;
  //     client.to(room).emit("message", messages.reverse);
  //   });
  console.log("room");
  console.log(room);
  db.Chatroom.findOne({ title: room })
    .then(room => {
      let idArr = room.messages;
      db.Message.find({ _id: { $in: idArr } }).then(messages => {
        console.log(messages);
        if (!messages.length) return;
        client.emit("message", messages);
      });
    })
    .catch(err => {
      console.log(err);
    });
}

function _sendAndSaveMessage(msg, room, client, fromServer) {
  let messageData = {
    text: msg.text,
    user: msg.user,
    // createdAt: new Date(message.createdAt),
    chatName: room
  };
  let connString = "https://murmuring-sea-22252.herokuapp.com/message/" + room;
  // let connString = "localhost:3001/message/" + room;

  // axios.post(connString, messageData).then(res => {
  //   console.log("axios post request made toward route");
  //   let emitter = fromServer ? io : client.to(room);
  //   emitter.emit("message", [msg], () => {
  //     console.log("post message emit");
  //   });
  // }).catch(error => {
  //   console.log(error);
  // });
  db.User.findOne({ userName: messageData.user.userName }).then(user => {
    let newMsg = {
      // Message
      text: messageData.text,
      user: user.name
    };

    db.Message.create(newMsg)
      .then(function(dbMessage) {
        // We will parse in the chatroom id, when making the post request
        db.Chatroom.findOneAndUpdate(
          { title: room },
          { $push: { messages: dbMessage._id } }
        ).then(() => {
          let emitter = fromServer ? io : client.to(room);
          emitter.emit("message", [msg]);
          console.log("chatroom updated");
        });
      })
      .catch(err => {
        if (err) console.log(err);
      });
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

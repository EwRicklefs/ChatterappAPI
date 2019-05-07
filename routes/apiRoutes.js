// Import database collections from the models folder
const db = require("../models");

module.exports = function(app) {
  //Dummy data
  //   const tempData = {
  //     userName: "TomJ",
  //     firstName: "Tom",
  //     lastName: "Jones",
  //     password: "passTom",
  //     homeLocation: "41^24'12.2N2^10'26.5E",
  //     currentLocation: "41^24'32.6N2^15'12.3E"
  //   };

  // //Dummy Note
  //   const tempMessage = {
  //     message: "Pokemons",
  //     data: "101023041005",
  //     name: "Tom"
  //   };

  //Dummy Chatroom
  //   const tempRoom = {
  //     title: "MTG RULES",
  //     description:
  //       "This is a great group with great people, playing a great game of magic",
  //     location: "41^24'12.2N2^10'26.5E"
  //   };
  app.get("/chats", (req, res) => {
    db.Chatroom.find()
      .then(function(response) {
        res.json(response);
      })
      .catch(err => {
        if (err) console.log(err);
      });
  });

  app.get("/messages", (req, res) => {
    db.Message.find()
      .then(function(response) {
        res.json(response);
      })
      .catch(err => {
        if (err) console.log(err);
      });
  });

  app.post("/chat", (req, res) => {
    db.Chatroom.create({
      title: "Ballard",
      description: "This is Ballard",
      location: "41^24'12.2N2^10'26.5E"
    })
      .then(dbChatroom => console.log(dbChatroom))
      .catch(err => {
        if (err) throw err;
      });
  });

  app.post("/message/:room", (req, res) => {
    let newMsg = {
      message: req.body.message,
      name: req.body.user,
      chatName: req.params.room
    };
    db.Message.create(newMsg)
      .then(function(dbMessage) {
        res.json(dbMessage)
        // We will parse in the chatroom id, when making the post request
        console.log(dbMessage._id)
        db.Chatroom.findOneAndUpdate(
          { title: req.params.room },
          { $push: { messages: dbMessage._id } }
        );
      })
      .then(function(test) {
        console.log("message inserted")
      })
      .catch(err => {
        if (err) console.log(err);
      });
  });

  app.get("/message/:room", (req, res) => {
    db.Message.find().sort;
  });

  // Route for grabing room and populating it with the messages
  db.Chatroom.findOne({ _id: "5ccc8061e8d46d44908c7001" })
    .populate("messages")
    .then(function(data) {
      console.log(data);
    })
    .catch(function(err) {
      console.log(err);
    });
};

const mongoose = require("mongoose");
const db = require("./models");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/chatterlocaldb", { useNewUrlParser: true });
// mongoose.connect("mongodb://heroku_gcgtf14g:qmsa1ecmde76ciish9m4osh24s@ds161295.mlab.com:61295/heroku_gcgtf14g", { useNewUrlParser: true });


const roomsSeed = [
    {
        messages: [],
        title: "Downtown",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "Capitol Hill",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "Queen Anne",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "South Lake Union",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "Magnolia",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "Ballard",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "Fremont",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "University District",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "Madison Park",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "First Hill",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "Central District",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "Downtown",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "International District",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "Mount Baker",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "Beacon Hill",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "SoDo",
        description: "Ballard but better",
        location: "dummy data"
    }, {
        messages: [],
        title: "Denny-Blaine",
        description: "Ballard but better",
        location: "dummy data"
    }
];

db.Chatroom
  .remove({})
  .then(() => db.Chatroom.collection.insertMany(roomsSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
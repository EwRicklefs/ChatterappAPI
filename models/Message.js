// Import Mongose
const mongoose = require("mongoose");

// Allows us to use the mongoose Schema constructor
const Schema = mongoose.Schema;

//Create a new Schema obj
const MessageSchema = new Schema({
    // Message
    message: String,
    // Time is was created
    time: { type : Date, default: Date.now },
    // Message owner
    name: {type: Schema.Types.userName, ref: 'User'},

    chatName: String

})

// Create model with the Schema above
const Message = mongoose.model("Message", MessageSchema);

//Export Chatroom model
module.exports = Message;
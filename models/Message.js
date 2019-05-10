// Import Mongose
const mongoose = require("mongoose");

// Allows us to use the mongoose Schema constructor
const Schema = mongoose.Schema;

//Create a new Schema obj
const MessageSchema = new Schema(
  {
    // Message
    text: String,
    // Time is was created
    createdAt: { type: Date, default: Date.now },
    // Message owner
    user: String
  }
  // , { toJSON: { virtuals: true } }
);

// MessageSchema.virtual('user', {
//     ref: 'User',
//     localField: 'name',
//     foreignField: 'userName',
//     justOne: true
// })

// Create model with the Schema above
const Message = mongoose.model("Message", MessageSchema);

//Export Chatroom model
module.exports = Message;

// .populate('name').exec((err, user)=> {
//     if (err) return err;
//     res.json
// })

//Import Mongoose
const mongoose = require("mongoose");

// Allows us to use the mongoose Schema contructor
const Schema = mongoose.Schema;

//Create a new Schema object
const UserSchema = new Schema({
    // Store the user's username, it must be a unique String
    userName: {
        type: String,
        unique: true
    },
    // Store the User's first and last name
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },

    // Store the user's passsword
    password: {
        type: String
    },
    
    // Store the user's home location
    homeLocation: {
        type: String
    },

    // Store the user's current location
    currentLocation: {
        type: String
    },

    
    // Store the user's joined chatrooms
    rooms: [
        {
            // Storing value of id
            type: Schema.Types.ObjectId,
            // This id will be refering to the Chatroom id
            ref: "Chatroom"
        }
    ]
});

// Create mondel with the Schema above
const User = mongoose.model("User", UserSchema);

// Export User model
module.exports = User;

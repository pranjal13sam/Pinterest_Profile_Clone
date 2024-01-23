const mongoose = require('mongoose');
const plm=require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/application1");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String
  },
  posts: [{//yeh array issiliye hai kyuki ek user kar saare posts bana skta hai
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post'
  }
  ],
  dp: {
    type: String, // Assuming that dp is a URL or file path to the user's display picture
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required:true
  },
});

userSchema.plugin(plm)

const User = mongoose.model('User', userSchema);

module.exports = User;

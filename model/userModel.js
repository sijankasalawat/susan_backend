const moongose = require("mongoose");
const userSchema = new moongose.Schema({
  fName: {
    type: String,
    require: true,
  },
  lName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  product:[
    {
      type:moongose.Schema.Types.ObjectId,
      ref:'Product'
    }
  ],
    
});
const User =moongose.model('User',userSchema);
module.exports=User;

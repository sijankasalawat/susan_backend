const moongose = require("mongoose");
const crypto = require("crypto");

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
  resetPasswordToken: String,
  resetPasswordExpire: Date,
    
});
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User =moongose.model('User',userSchema);
module.exports=User;

import mongoose from "mongoose";


// Schema
let schema = mongoose.Schema({
  email: {type: String ,default:""},
  password: {type:String,default:""},
  otp:{type:Number,default:0},
  isBan:{type:Boolean,default:false},
  isLock:{type:Boolean,default:false},
  otpExpireTime:{type:Number,default:0},
  tryCount:{type:Number,default:0}
});


let modal = mongoose.model("loginDetails", schema, "loginDetails");


export default modal;

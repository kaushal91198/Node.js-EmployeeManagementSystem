var mongo = require("mongoose")
var url = 'mongodb://localhost:27017/express';
// var con  = mongo.connection
mongo.connect(url,()=>{console.log("connected database")});

var userSchemaa = new mongo.Schema({
    userName: {
        type: String,
        required: true,
        unique: true // `email` must be unique
      },  
    email: {
        type: String,
        required: true,
        unique: true // `email` must be unique
      }, 
      password:{
        type: String,
        required: true,
      }   
})

var userModel = mongo.model("admin",userSchemaa)
 

module.exports = userModel
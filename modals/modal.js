var mongo = require("mongoose")
var url = 'mongodb://localhost:27017/express';
// var con  = mongo.connection
mongo.connect(url,()=>{console.log("connected database")});

var employeeSchemaa = new mongo.Schema({
    name:String,
    email:String,
    etype:String,
    hourlyrate:Number,
    totalhour:Number,
    total:Number,
    image:String
})

var employeeModel = mongo.model("Employee",employeeSchemaa)
 

module.exports = employeeModel
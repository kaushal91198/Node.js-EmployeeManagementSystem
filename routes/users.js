var express = require('express');
var router = express.Router();
var session = require('express-session')
var adminModel  = require("../modals/users")
var jwt = require('jsonwebtoken')


var username = (req,res,next)=>{
  var username1=req.body.userName
  adminModel.findOne({userName:username1},(err,data)=>{
    if(err) throw err
    if(data!=null){ return res.render('signup',  { title: 'signup',msg:"please enter another username "})}
    next()
})
}


var email = function (req,res,next){
  var email1=req.body.email
  adminModel.findOne({email:email1},(err,data)=>{
    if(err) throw err
    if(data!=null){ return res.render('signup',  { title: 'signup',msg:"please enter another email "})}
    next()
})
}


var loginname = (req,res,next)=>{
  var username1=req.body.userName
  adminModel.findOne({userName:username1},(err,data)=>{
    if(err) throw err
    if(data==null){ return res.render('login',  { title: 'login',msg:"please enter correct username "})}
    next()
})
}

var loginpassword = (req,res,next)=>{
  var password1 = req.body.password
  adminModel.findOne({password:password1},(err,data)=>{
    if(err) throw err
    if(data==null){
      return res.render('login',  { title:'login',msg:"please enter correct password "})
    }
    req.id = data._id
    next()
})
}



router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login',msg:"Login"});
});

router.get('/logout',(req,res)=>{
      req.session.destroy(function(err) {
        if(err) return res.render('login', { title: 'Login',msg:"You have not successfully logged out."});
      })
      res.render('login', { title: 'Login',msg:"You have successfully logged out."});
    })
router.post('/',loginname,loginpassword, function(req, res) {
  console.log(req.body.userName)
  var token = jwt.sign({userId:req.id}, 'loginToken');
  req.session.token = token
  req.session.userName =req.body.userName
  res.redirect("/users/view")
});

router.get('/signup', function(req, res) {
  res.render('signup', { title: 'signup',msg:"User Signup"});
  })
router.post('/signup', username,email, function(req, res) {
  console.log(req.body)
  var users = new adminModel(req.body)
  users.save((err,res1)=>{
    if(err) throw err;
    console.log('Saving data successfully');
    res.render('signup', { title: 'signup',msg:"You have successfully submitted details"});
  })
});





module.exports = router;

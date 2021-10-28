var express = require('express');
var empModel  = require("../modals/modal")
var router = express.Router();
var path = require('path')
var jwt = require('jsonwebtoken')
var session = require('express-session')
const fs = require('fs')
const multer  = require('multer')

router.use(express.static('public'));


var loginMiddleware  = function(req,res,next){
  
    try {
            var token =  req.session.token
            jwt.verify(token,'loginToken')     
    } catch (error) {
        return res.render('login',  { title: 'login',msg:"You need to login to access this page"})    
    }
   next()
}
router.use(loginMiddleware)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
      }, 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
     
    }
})
const upload = multer({ storage: storage }).single('file')


router.get("/insert",function(req,res){
    var user = req.session.userName;
    res.render('index', { title: "Insert records",logged:user});
})
router.get('/view', function(req, res) {
    var user = req.session.userName;
    
    empModel.find({},(err,data)=>{
        if (err) throw err;
        res.render('view',{title:'Employee Records', logged:user,records:data })
    })
   
});


router.get("/search",function(req,res){
    var user = req.session.userName;
    res.render('search', { title: "Filter records",logged:user});

})
router.get("/edit/:id",(req,res)=>{
    var user = req.session.userName;
    let id = req.params.id;
    empModel.findById(id,(err,data)=>{
        if(err) throw err;
        // console.log(data)
        res.render('edit', { title: 'Editing Records',records:data, logged:user });
    })
})
router.get("/row/:id",(req,res)=>{
    var user =req.session.userName;
    let id = req.params.id;
    empModel.findById(id,(err,data)=>{
        if(err) throw err;
        res.render('row', { title: 'Editing Records',records:data, logged:user });
    })
})
router.get("/delete/:id",(req,res)=>{
    
    let id = req.params.id
    empModel.findByIdAndDelete(id,(err,data)=>{
        if(err) throw err;  
        fs.unlinkSync(path.join(__dirname, `../public/uploads/${data.image}`))
        console.log("Successfully deleted")
        res.redirect('/users/view')
    })
})


router.post("/",upload,function(req,res) {
        var employees = new empModel({
            name:req.body.name,
            email:req.body.email,
            etype:req.body.etype,
            hourlyrate:parseInt(req.body.hourlyrate),
            totalhour:parseInt(req.body.totalhour),
            total:parseInt(req.body.hourlyrate)*parseInt(req.body.totalhour),
            image:req.file.filename
        })
        employees.save((err,res1)=>{
            if(err) throw err;
            console.log('Saving data successfully');
            res.redirect('/users/view')
        })
      
})

router.post('/search', function(req, res) {
    var user = req.session.userName;
    var flrtName = req.body.name;
    var flrtEmail = req.body.email;
    var fltremptype = req.body.etype;
    console.log(flrtName,flrtEmail,fltremptype)
    
    if(flrtName !='' && flrtEmail !='' && fltremptype !='' ){

    var flterParameter={ $and:[{ name:flrtName},{email:flrtEmail},{etype:fltremptype}]}
    }else if(flrtName !='' && flrtEmail =='' && fltremptype !=''){
      var flterParameter={ $and:[{ name:flrtName},{etype:fltremptype}]
         }
    }else if(flrtName =='' && flrtEmail !='' && fltremptype !=''){
  
      var flterParameter={ $and:[{ email:flrtEmail},{etype:fltremptype}]
         }
    }else if(flrtName =='' && flrtEmail =='' && fltremptype !=''){
  
      var flterParameter={etype:fltremptype
         }
    }else{
      var flterParameter={}
    }
   
    empModel.find(flterParameter,(err,data)=>{
        if(err) throw err
        res.render('filter',{title:'Filtered Employee Records', logged:user,records:data });
        })
   
  })

router.post("/update/:id",upload,function(req,res) {
            let id = req.params.id
            var updatedData = {
            name:req.body.name,
            email:req.body.email,
            etype:req.body.etype,
            hourlyrate:parseInt(req.body.hourlyrate),
            totalhour:parseInt(req.body.totalhour),
            total:parseInt(req.body.hourlyrate)*parseInt(req.body.totalhour)
        }
        if(req.file){
                updatedData['image']=req.file.filename
                console.log("used if condition")
                empModel.findByIdAndUpdate(id,updatedData,(err,data)=>{
                if (err) throw err
                fs.unlinkSync(path.join(__dirname, `../public/uploads/${data.image}`))
            })

        }
        else{
            console.log("used else condition")
            empModel.findByIdAndUpdate(id,updatedData,(err,data)=>{
                if (err) throw err

            })
        }
            res.redirect("/users/view")
})
 

module.exports = router;


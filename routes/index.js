var express = require('express');
var router = express.Router();
const userModel=require("./users");
const postModel=require("./posts");
const passport=require('passport');
const upload=require("./multer")

//inn dono line se user login hotah hai
const localStrategy=require("passport-local")
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/create',async function(req,res){
//   let createduser=await userModel.create({
//     username: "samarth",
//     password: "Mylife13@",
//     posts: [],
//     email: "pandeypranjal264@gmail.com",
//     fullName:"Pranjal Pandey",
//   });
//   res.send(createduser);
// })

// router.get('/createpost',async function(req,res){
//   let createdpost=await postModel.create({
//     postText:"Heloo everyone",
//     user:"65a94fbd261ccc50b1d24b4b",
//   });
//   let user=await userModel.findOne({_id:"65a94fbd261ccc50b1d24b4b"});//yeh sab hum issiliye likh rahe hai kyuki iske uper waale line tak sirf post ke paas user ki id thi user ke paas post ki id nhi thi toh user ke paas v post ki id ho issliye iss line se niche tak jo v likha hai wo issi ke baare mei hai
//   user.posts.push(createdpost._id);
//   await user.save();
//   res.send("done");
// })

// //how to see ki ek user ne kitne posts banaye

// router.get('/alluser',async function(req,res){
//   let user=await userModel.findOne({_id:"65a94fbd261ccc50b1d24b4b"}).populate('posts');//hum populate issiliye use kar rahe kyuki agar hum populate user nhi karenge toh hume sirf posts ki id milegi jab hum server par jaayenge toh but when we use populate we get the whole data
//   res.send(user);
// })

//ab yaha se hum pinterest project bana rahe hai:


//login route:

router.get('/login',function(req,res,next){
  //yeh console log flash messages ko terminal me display karne ke liye use kiya gya hai
  //console.log(req.flash("error"));
  res.render('login',{error:req.flash('error')});
})

//feed ka route:
router.get('/feed',function(req,res,next){
  res.render('feed');
})

//multer ka code photos aur files upload karne ke liye:
router.post('/upload',isLoggedIn,upload.single("file"),async function(req,res,next){
  if(!req.file){
    return res.status(404).send("NO files were given")
  }
  //res.send("file uploaded Successfully")
  //jo file upload hui hai uuse save karo as a post and uska postid user ko do and post ko usesrid do
  const user=await userModel.findOne({username:req.session.passport.user})
  const post =await postModel.create({
    image:req.file.filename,
    imagetext:req.body.filecaption,
    user:user._id
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile')
});

//yeh profile ka route hai:
router.get('/profile',isLoggedIn, async function(req,res,next){
  const user=await userModel.findOne({//isse kya hoga ki jo v user logged in hai uska user data store ho jaayega
    username:req.session.passport.user
  })
  .populate('posts');
  console.log(user)
  res.render("profile",{user})
});

//yaha pe humne register karne ka code likha hai:
router.post("/register",function(req,res){
  const {username,email,fullName}=req.body;
  const userData=new userModel({username,email,fullName})


  //aur yaha agar registered successfully hogya toh usko sidha profile page pe redirect kardene ka
  userModel.register(userData,req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
})

router.post("/login",passport.authenticate("local",{successRedirect:"/profile",failureRedirect:"/login",
failureFlash:true})/*jab properly login nhi ho paaye toh flash messages dikhane ke liye for example login ya password galat daal diya toh */,function(req,res){

})

router.get("/logout",function(req,res){
  req.logout(function(err){
    if(err){
      return next(err);
    }res.redirect('/');
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}



module.exports = router;

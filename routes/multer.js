//npm i multer

const path=require("path")
const multer= require("multer");
const {v4: uuidv4}=require("uuid");



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        file.originalname
        const uniquename=uuidv4();
        //path.extname(file.originalname)=>add kiya gya hai extension taaki image load or upload kar paaye kyuki yeh code likhne se ek extension jaise .pdf ya .png create ho ja rha
      cb(null, uniquename+path.extname(file.originalname));
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports=upload;
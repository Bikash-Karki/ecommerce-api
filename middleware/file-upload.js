const multer = require('multer')
const fs = require('fs')
const path = require('path')

const storage = multer.diskStorage({
 destination:(req, file, cb)=>{
  let fileDestination = 'public/uploads/'
  //check if directory exists
  if(!fs.existsSync(fileDestination)){
   fs.mkdirSync(fileDestination,{recursive:true})
   //recursive true means it creates parent folder as well as sub folder
   cb(null, fileDestination)
  }
  else{
   cb(null, fileDestination)
  }
 },
 filename:(req, file, cb)=>{
  let fileName = path.basename(file.originalname, path.extname(file.originalname))
  let ext = path.extname(file.originalname)
  cb(null, fileName+'_'+Date.now()+ext)
 }
})

let imageFilter = (req, file, cb)=>{
 if(!file.originalname.match(/\.(jpg|png|jpeg|svg|jfif|JPG|PNG|JPEG|SVG|JFIF)$/)){
  return cb(new Error('You can upload image file only'), false)
 }
 else{
  cb(null, true)
 }
}
let upload = multer({
 storage:storage,
 fileFilter:imageFilter,
 limits:{
  fileSize:2000000 //2MB
 }
})

module.exports = upload
const User = require('../models/authModel');
const Token = require('../models/tokenModel');
const sendEmail = require('../utils/setEmail');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); //authentication
const expressJwt = require('express-jwt'); //authorization
// const html = require('./template.html')
//register user and send email confirmation link

exports.userRegistration = async (req, res) => {
 let user = new User({
  name: req.body.name,
  email: req.body.email,
  password: req.body.password
 })
 user = await user.save()
 if (!user) {
  return res.status(400).json({ error: 'Something went wrong' })
 }
 let token = new Token({
  token: crypto.randomBytes(16).toString('hex'),
  userId: user._id
 })
 token = await token.save()
 if (!token) {
  return res.status(400).json({ error: 'Something went wrong' })
 }
 const url = process.env.FRONTEND_URL+'\/email\/confirmation\/'+token.token
 //send email
 sendEmail({
  from: 'no-reply@ecommerce.com',
  to: user.email,
  subject: 'Email Verification Link',
  text: `Hello, \n \n Please confirm your email by copying the below link :\n\n 
  http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
  html: `<h2>Verify Your Email</h2>
  <button><a href = ${url}>Verify</a></button>`
  //http:localhost:5000/api/confirmation/984uenf39

 })
 res.send(user)
}
//post email confirmation

exports.postEmailConfirmation = (req, res) => {
 //at first find the valid or matching token
 Token.findOne({ token: req.params.token }, (error, token) => {
  if (error || !token) {
   return res.status(400).json({ error: 'Invalid Token or Token may have expired' })
  }
  //if token found then find the valid iser for that token
  User.findOne({ _id: token.userId }, (error, user) => {
   if (error || !user) {
    return res.staus(400).json({ error: 'We are unable to find valid user for this token' })
   }
   //check if user is already verified
   if (user.isVerified) {
    return res.status(400).json({ error: `Dear ${user.name}, Your Email: ${user.email} has already been verified, Login to continue` })
   }
   //save the verified user
   user.isVerified = true;
   user.save((error) => {
    if (error) {
     return res.status(400).json({ error: error })
    }
    res.json({ message: `Congrats ${user.name}, Your email has been verified successfully` })
   })

  })
 })
}
//sign in
exports.signIn = async (req, res) => {
 const { email, password } = req.body
 //at first find the email's registered or not
 const user = await User.findOne({ email })
 if (!user) {
  return res.status(400).json({ error: `Oops! The email is not found in our system. Please try another.` })
 }
 //if email found then check the password
 if (!user.authenticate(password)) {
  return res.status(400).json({ error: 'Email or Password doesnot matched' })
 }
 //check if user is verified or not
 if (!user.isVerified) {
  return res.staus(400).json({ error: 'Please verify your email before proceeding' })
 }
 //now generate token using user id and JWT_SECRET
 const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
 //now store the token in cookie
 res.cookie('myCookie', token, { expire: Date.now() + 999999 })
 //to send user information in front end
 const { _id, role, name } = user
 return res.json({ token, user: { name, email, _id, role } })

}

//sign out
exports.signOut = (req, res) => {
 res.clearCookie('myCookie')
 res.json({ message: 'Signed Out Succesfully' })
}

//forget password
exports.forgetPassword = async (req, res) => {
 const user = await User.findOne({ email: req.body.email })
 if (!user) {
  return res.status(400).json({ error: 'Oops! Email not registered' })
 }
 let token = new Token({
  token: crypto.randomBytes(16).toString('hex'),
  userId: user._id
 })
 token = await token.save()
 if (!token) {
  return res.status(400).json({ error: 'Something went wrong' })
 }
 //send email 
 sendEmail({
  from: 'no-reply@ecommerce.com',
  to: user.email,
  subject: 'Password Reset Link',
  text: `Hello, \n \n Please reset your password by copying the below link :\n\n 
  http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`
  
 })
 res.json({message:'password reset link has been sent to your email'})
}
//reset password
exports.resetPassword = async(req,res)=>{
 //at first find the valid or matching token
 let token = await Token.findOne({token:req.params.token})
 if(!token){
  return res.status(400).json({error:"Invalid Token or Token may have expired"})
 }
 //if token found then find the valid user
 let user = await User.findOne({
  email:req.body.email,
  _id:token.userId
 })
 if(!user){
  return res.status(400).json({error:'We are unable to find a valid user for this token'})
 }
 user.password = req.body.password
 user=await user.save()
 if(!user){
  return res.status(400).json({error:"Failed to reset password"})
 }
 res.json({message:"Password has been reset successfully"})
}

//user list
exports.userList = async(req,res)=>{
 const user = await User.find().select('-hashed_password')
 if(!user){
  return res.staus(400).json({error:"Something Went wrong"})
 }
 res.send(user)
}
//view specific user
exports.userDetails = async(req, res)=>{
 const user = await User.findById(req.params.id).select('-hashed_password')
 if(!user){
  return res.staus(400).json({error:"Something Went wrong"})
 }
 res.send(user)
}

//reset verification email
exports.resendVerification = async(req,res)=>{
 //at first find the registered user
 const user = await User.findOne({email:req.body.email})
 if(!user){
  return res.status(400).json({error:"Sorry the email you provided is not in our system"})
 }
 if(user.isVerified){
  return res.status(400).json({error:'Email has already been verified, Login to continue'})
 }
 //create token to store in database and send to email as params
 let token = new Token({
  token:crypto.randomBytes(16).toString('hex'),
  userId:user._id
 })
 token = await token.save()
 if(!token){
  return res.status(400).json({error:'Something went wrong'})
 }
 //send email
 sendEmail({
  from: 'no-reply@ecommerce.com',
  to: user.email,
  subject: 'Email Verification Link',
  text: `Hello, \n \n Please confirm your email by copying the below link :\n\n 
  http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`
  //http:localhost:5000/api/confirmation/984uenf39

 })
 res.json({message:"Account verification link has been sent to your mail"}) 

}
//authorization
exports.requireSignin = expressJwt({
 secret:process.env.JWT_SECRET,
 algorithms:['HS256'],
 userProperty:'auth'
})
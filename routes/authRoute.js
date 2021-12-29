const express = require('express')
const router = express.Router()
const { userRegistration, postEmailConfirmation, signIn, signOut, forgetPassword, resetPassword, userList, userDetails, resendVerification, requireSignin } = require('../controllers/authController')

router.post('/register',userRegistration)
router.post('/confirmation/:token', postEmailConfirmation)
router.post('/signin', signIn)
router.post('/signout',requireSignin, signOut)
router.post('/forgetpassword', forgetPassword)
router.put('/resetpassword/:token', resetPassword)
router.get('/userlist',requireSignin, userList)
router.get('/userdetails/:id',requireSignin, userDetails)
router.post('/resendverification', resendVerification)

module.exports=router
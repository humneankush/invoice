import express from 'express'

import { signin,signup,resetPassword,forgotPassword } from '../controllers/user.mjs'

const router = express.Router()

// console.log(router);
router.post('/signin',signin)
router.post('/signup',signup)
router.post('/resetPassword',resetPassword)
router.post('/forgotPassword',forgotPassword)




export default router;
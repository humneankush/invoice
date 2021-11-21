import User from '../models/userModel.mjs'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import  jwt  from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
const SECRET = process.env.SECRET_KEY
const HOST =  process.env.SMTP_HOST
const PORT =  process.env.SMTP_PORT
const USER =  process.env.SMTP_USER
const PASS =  process.env.SMTP_PASS


export const signin = async (req, res)=> {
    const { email, password } = req.body //Coming from formData

    try {
        const existingUser = await User.findOne({ email })

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })

        const isPasswordCorrect  = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"})

        //If crednetials are valid, create a token for the user
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET, { expiresIn: "1h" })
        
        console.log(existingUser);
        //Then send the token to the client/frontend
        // const {password,...others}= existingUser
        res.status(200).json({ result: existingUser,token })

    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}


export const signup  = async(req,res)=>{
    const { name,email,password} = req.body

    try {
        const existingUser = await User.find({email})

        if(!existingUser) return res.status(400).json({message:"user already exist"})

        // if (password!==confirmPassword) return res.status(400).json({message:"password don't match"})

        const hashPassword = await bcrypt.hash(password,12)

        const result  = await User.create({email,password:hashPassword,name:`${name}`})

 const token = jwt.sign({ email: result.email, id: result._id }, SECRET, { expiresIn: "1h" })
        
        res.status(200).json({result,token})
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
        
    }
}

export const resetPassword = async(req,res)=>{
     const password = req.body.password
     const sentToken = req.body.token

     User.findOne({
         resetToken :sentToken,expireToken:{$gt:Date.now()}
     })
     .then(user=>{
         if(!user){
             return res.status(422).json({error:"Try again session expired"})
         }
         bcrypt.hash(newPassword,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((saveduser)=>{
                res.json({message:"password updated successfully"})
            })
         })
     }).catch(err=>{
         console.log(err)
     })
     
}


export const forgotPassword=(req,res)=>{
    const {email} = req.body


       // NODEMAILER TRANSPORT FOR SENDING POST NOTIFICATION VIA EMAIL

       const transporter = nodemailer.createTransport({
           host : HOST,
           port:PORT,
           auth:{
               user:USER,
               pass:PASS

           },
           tls:{
               rejectUnauthorized:false
           }


       })
       crypto.randomBytes(32,(err,buffer)=>{
           if(err){
               console.log(err);
           }
           const token = buffer.toString('hex')
           User.findOne({email:email})
           .then(user=>{
               if(!user){
                return res.status(422).json({error:"User does not exist in our database"})
               }
               user.resetToken = token
               user.expireToken = Date.now() + 3600000
               user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"Arc Invoice <hello@invoice.com>",
                    subject:"Password reset request",
                    html:`
                    <p>You requested for password reset from Arc Invoicing application</p>
                    <h5>Please click this <a href="https://invoice.com/reset/${token}">link</a> to reset your password</h5>
                    <p>Link not clickable?, copy and paste the following url in your address bar.</p>
                    <p>https://invoice.com/reset/${token}</p>
                    <P>If this was a mistake, just ignore this email and nothing will happen.</P>
                    `
                })
                res.json({message:"check your email"})
            }).catch((err) => console.log(err))
  
           })
       })
}
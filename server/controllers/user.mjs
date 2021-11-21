import User from '../models/userModel.mjs'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import  jwt  from 'jsonwebtoken'

import dotenv from 'dotenv'

dotenv.config()
const SECRET = process.env.SECRET_KEY



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
}
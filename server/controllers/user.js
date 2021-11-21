import User from '../models/userModel'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'


export const signin = async(req,res)=>{
    const {email,password} = req.body //coming from formDAta

    try {

        const existingUser = await User.find({email})
        
        if(existingUser) return res.status(400).json({message:"user already exist"})

        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json({message:"invalid password"})

        res.status(200).json({result:existingUser})


    } catch (error) {


        res.status(500).json({message:"something went wrong"})
        
    }

}

export const signup  = async(req,res)=>{
    const { email, password, confirmPassword, firstName, lastName, bio } = req.body

    try {
        const existingUser = await User.find({email})

        if(existingUser) return res.status(400).json({message:"user already exist"})

        if (password!==confirmPassword) return res.status(400).json({message:"password don't match"})

        const hashPassword = await bcrypt.hash(password,12)

        const result  = await User.create({email,password:hashPassword,name:`${firstName} ${lastName}`,bio})
        
        res.status(200).json({result})
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
        
    }
}
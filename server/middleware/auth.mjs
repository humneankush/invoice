import { Jwt } from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()
const SECRET = process.env.SECRET_KEY




const auth = async (req,res,next)=>{
    try {
        const token = req.headers.authorization.split("")[1]
        const isCustomAuth = token.length<500

        let decodeData;

        // if token is cutom token do this
        if(token && isCustomAuth){
            decodeData = jwt.verify(token,SECRET)
            req.userId = decodeData?.id
        }else{
            // else of token is google token then do this
            decodeData = jwt.decode(token)
            req.userId=decodeData?.sub
        }

        next()
    } catch (error) {
        console.log(error)
    }
}

export default auth;
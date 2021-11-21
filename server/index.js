import express from "express"
import  mongoose  from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

const app = express()






app.use((express.json({limit:'30mb',extended:true})))
app.use((express.urlencoded({limit:"30mb",extended:true})))

const DB_URL = process.env.DB_URL
const PORT = process.env.PORT || 5000
const hostname = 'localhost';

mongoose.connect(DB_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
})
    .then(() => console.log("connected to mongodb"))
    .catch((error) => console.log(error.message))

// mongoose.set('useFindAndModify', false)
// mongoose.set('useCreateIndex', true)


app.listen(PORT, () => {
    console.log("Backend is running." + PORT);
  });
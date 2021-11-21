import express from "express"
import  mongoose  from "mongoose"
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.mjs'
import profile from './routes/profile.mjs'

import invoiceRoutes from './routes/invoices.mjs'
import clientRoutes from './routes/clients.mjs'


dotenv.config()

const app = express()






app.use((express.json({limit:'30mb',extended:true})))
app.use((express.urlencoded({limit:"30mb",extended:true})))


app.use('/users', userRoutes)
app.use('/profile',profile)
app.use('/invoices', invoiceRoutes)
app.use('/clients', clientRoutes)

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


// for testing
app.get('*', (req, res) => {
    res.status(404).json({
        success:false,
        message:"page not found",
        error:{
            statusCode:404,
            message:"you reached a route that is not defined on this server"
        }
    })
  })


app.listen(PORT, () => {
    console.log("Backend is running." + PORT);
  });
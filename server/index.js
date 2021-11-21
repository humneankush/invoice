import express from "express"
import  mongoose  from "mongoose"
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.mjs'
import profile from './routes/profile.mjs'
import cors from 'cors'
import pdf from 'html-pdf'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import invoiceRoutes from './routes/invoices.mjs'
import clientRoutes from './routes/clients.mjs'
import nodemailer from 'nodemailer'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import pdfTemplate from './documents/index.mjs'
import emailTemplate from './documents/email.mjs'

dotenv.config()

const app = express()






app.use((express.json({limit:'30mb',extended:true})))
app.use((express.urlencoded({limit:"30mb",extended:true})))
app.use((cors()))

app.use('/users', userRoutes)
app.use('/profile',profile)
app.use('/invoices', invoiceRoutes)
app.use('/clients', clientRoutes)

const DB_URL = process.env.DB_URL
const PORT = process.env.PORT || 5000
const hostname = 'localhost';


// NODEMAILER TRANSPORT FOR SENDING INVOICE VIA EMAIL
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port : process.env.SMTP_PORT,
    auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
    },
    tls:{
        rejectUnauthorized:false
    }
})


var options = { format: 'A4' };
//SEND PDF INVOICE VIA EMAIL
app.post('/send-pdf', (req, res) => {
    const { email, company } = req.body

    // pdf.create(pdfTemplate(req.body), {}).toFile('invoice.pdf', (err) => {
    pdf.create(pdfTemplate(req.body), options).toFile('invoice.pdf', (err) => {
       
          // send mail with defined transport object
        transporter.sendMail({
            from: `${company.businessName ? company.businessName : company.name} <hello@arcinvoice.com>`, // sender address
            to: `${email}`, // list of receivers
            replyTo: `${company.email}`,
            subject: `Invoice from ${company.businessName ? company.businessName : company.name}`, // Subject line
            text: `Invoice from ${company.businessName ? company.businessName : company.name }`, // plain text body
            html: emailTemplate(req.body), // html body
            attachments: [{
                filename: 'invoice.pdf',
                path: `${__dirname}/invoice.pdf`
            }]
        });

        if(err) {
            res.send(Promise.reject());
        }
        res.send(Promise.resolve());
    });
});

//CREATE AND SEND PDF INVOICE
app.post('/create-pdf', (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('invoice.pdf', (err) => {
        if(err) {
            res.send(Promise.reject());
        }
        res.send(Promise.resolve());
    });
});

//SEND PDF INVOICE
app.get('/fetch-pdf', (req, res) => {
     res.sendFile(`${__dirname}/invoice.pdf`)
})




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
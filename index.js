const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/user')
const nodemailer = require('nodemailer')
const ejs = require('ejs')
//const NewPia = require('./models/newPIA')


const app = express()
const PORT = process.env.PORT || 3000
const path = require('path')

const  reactBuild = path.join(__dirname, 'front', 'build')

const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]

    if (!token) {
        res.send('need token')
    } else{
        jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
            if (err){
                res.json({
                    auth: false,
                    status: "you are fail to auth",
                })
            } else {
                next()
            }
        })
    }
}

require("dotenv").config()

// Set up email transporter
const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    auth: {
        user: process.env.NOTIF_EMAIL_USER,
        pass: process.env.NOTIF_EMAIL_PWD
    }
})

// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
});

app.use(express.static(reactBuild))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/*', async(req, res) => {
        res.sendFile(path.join(reactBuild, 'index.html'))
})

app.post('/emailNewPia/:user_email', async (req, res) => {
    const user_email = req.params.user_email.substring(1);
    const pia_url = "http://localhost:3000"
    const event_msg = `A new Privacy Impact Assessment has been submitted by ${user_email}.`

    try {
        let data = await ejs.renderFile(__dirname + "/views/email_template.ejs", { event_msg: event_msg, pia_url: pia_url });

        const options = {
            from: process.env.NOTIF_EMAIL_USER,
            to: "POFORTIS@outlook.com",
            subject: "New PIA",
            text: `A new Privacy Impact Assessment has been submitted by ${user_email}. Click to view: http://localhost:3000`,
            html: data
        }

        let result = await transporter.sendMail(options);    
        console.log(result);
    } catch(err) {
        console.log(err);
    }
})

app.post('/login', (req, res) => {
    const mail = req.body.email
    User.findOne({email: mail}).then((result) => {
        if (result !== null){
            const id = result._id
            const token = jwt.sign({id}, process.env.JWT_VAR, {
                expiresIn: 2000
            })
            res.json({
                auth: true,
                token: token,
                isOfficer: result.isOfficer
            })
        }
        else {
            res.json({
                auth: false,
                message: "You are not in database"
            })
        }

    })
})

app.post('/isUserAuth', (req, res) => {
    const token = req.headers["x-access-token"]
    if (!token) {
        res.json({
            auth: false,
            status: "Token not provided",
        })
    } else {
       jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
            if (err){
                res.json({
                    auth: false,
                    status: "error during verifying token",
                })
            } else {
                User.findById(decoded.id , (error, result) => {
                    if (result === null){
                        res.json({
                            auth: false,
                            status: "error during verifying token",
                        })
                    } else if (error){
                        console.log(error)
                        res.json({
                            auth: false,
                            status: "error during verifying token",
                        })
                    }
                    else{
                        res.json({
                            auth: true,
                            status: "success auth",
                            isOfficer: result.isOfficer,
                            email: result.email
                        })
                    }
                })
            }
        })
    }

})

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then((result) => {
            console.log('connected to db')
            app.listen(PORT, ()=>{console.log('server is running on ' + PORT)})
    }
).catch((err) => {
        console.log(err)
})



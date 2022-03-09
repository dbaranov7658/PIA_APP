const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/user')

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
        jwt.verify(token, "jwtSecret", (err, decoded) => {
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


app.use(express.static(reactBuild))
app.use(express.json())

app.get('/', async(req, res) => {
        res.sendFile(path.join(reactBuild, 'index.html'))
})

app.get('/getUser', (req, res) => {

    User.findById('621eb64ca9dd8e8b5c2b8746').then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})

app.get('/getAllUsers', (req, res) => {
    User.find().then((result) => {
        res.send(result)
        }
    ).catch((err) => {
        console.log(err)
    })
})

app.get('/deleteUser', (req, res) => {
    User.deleteOne({ _id: '6226bd72fdfcc70fe0bd604e'}).then((result) => {
            res.send(result)
        }
    ).catch((err) => {
        console.log(err)
    })
})

app.post('/login', (req, res) => {
    const mail = req.body.email
    User.findOne({email: mail}).then((result) => {
        const id = result._id
        const token = jwt.sign({id}, process.env.JWT_VAR, {
                expiresIn: 2000
            })
        res.json({
            auth: true,
            token: token,
            isOfficer: result.isOfficer
        })
    })


})

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then((result) => {
            console.log('connected to db')
            app.listen(PORT, ()=>{console.log('server is running on ' + PORT)})
    }
).catch((err) => {
        console.log(err)
})


app.get('/isUserAuth', verifyJWT, (req, res) => {
    res.json({
        auth: true,
        status: "you are auth",
    })
})


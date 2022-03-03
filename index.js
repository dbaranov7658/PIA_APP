const express = require('express')
const mongoose = require('mongoose')
const dbURI = 'mongodb+srv://admin:Cc5YUp6CyQNrb2X@fortisdb.pj07g.mongodb.net/FortisPIA?retryWrites=true&w=majority'
const User = require('./models/user')

const app = express()
const PORT = process.env.PORT || 3000
const path = require('path')

const  reactBuild = path.join(__dirname, 'front', 'build')





app.use(express.static(reactBuild))

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
    User.deleteOne({ _id: '621eb64ca9dd8e8b5c2b8746'}).then((result) => {
            res.send(result)
        }
    ).catch((err) => {
        console.log(err)
    })
})



mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true}).then((result) => {
            console.log('connected to db')
            app.listen(PORT, ()=>{console.log('server is running on ' + PORT)})
    }
).catch((err) => {
        console.log(err)
})
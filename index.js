const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const app = express()
const PORT = process.env.PORT || 3000
const path = require('path')
const  reactBuild = path.join(__dirname, 'front', 'build')

require("dotenv").config()

app.use(express.static(reactBuild))
app.use(express.json())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/', cors());

app.use('/', require('./routes/allRoutes'))

app.get('/*', async(req, res) => {
    res.sendFile(path.join(reactBuild, 'index.html'))
})

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then((result) => {
    console.log('connected to db')
    app.listen(PORT, () => {
        console.log('server is running on ' + PORT)
        app.emit("app_started")
        setTimeout(() => {
            app.emit("messages_ready")
          }, 1500);
    })
    }
).catch((err) => {
        console.log(err)
})

module.exports = app;



  
const express = require('express')
const {emailNewPia} = require('../controllers/email_controller')
const _r = express.Router()

/*
 * Email routes
 */
_r.post('/emailNewPia/:user_email', emailNewPia)

module.exports = _r
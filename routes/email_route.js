
  
const express = require('express')
const {emailNewPia, emailCommentPia, emailEditPia} = require('../controllers/email_controller')
const _r = express.Router()

/*
 * Email routes
 */
_r.post('/emailNewPia/:user_email', emailNewPia)
_r.post('/emailCommentPia/:user_email', emailCommentPia)
_r.post('/emailEditPia/:user_email', emailEditPia)

module.exports = _r
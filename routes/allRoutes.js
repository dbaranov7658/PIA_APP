
  
const express = require('express')
const {emailNewPia, emailCommentPia, emailEditPia, emailApprovePia, emailRejectPia, emailDeletePia} = require('../controllers/email_controller')
const {login, getAllPia, isUserAuth, deletePia, addNew} = require('../controllers/Api')
const jwt = require("jsonwebtoken");
const _r = express.Router()

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]

    if (!token) {
        res.json({
            auth: false,
            status: "There is not token",
        })
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


_r.post('/emailNewPia/:user_email', emailNewPia)
_r.post('/emailCommentPia/:user_email', emailCommentPia)
_r.post('/emailEditPia/:user_email', emailEditPia)
_r.post('/emailApprovePia', emailApprovePia)
_r.post('/emailRejectPia', emailRejectPia)
_r.post('/emailDeletePia', emailDeletePia)
_r.post('/login', login)
_r.post('/getAllPia', verifyJWT, getAllPia)
_r.post('/isUserAuth', isUserAuth)
_r.post('/deletePia', verifyJWT, deletePia)
_r.post('/addNew', verifyJWT, addNew)

module.exports = _r
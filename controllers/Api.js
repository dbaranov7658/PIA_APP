const User = require("../models/user");
const jwt = require("jsonwebtoken");
const existingPia = require("../models/piaSchema");
const {setUpEdit, setUpEmail, sendEmail, getPrivacyOfficers} = require("../Emails/emails");
const CryptoJS =  require("crypto-js");
const Path = require("path");
const ejs = require("ejs");
const pdf = require('html-pdf');
const { setUpPdf } = require('../printFunctionality/pdfSetup');

const fs = require('fs');

function encrypted(encryptedString){
    return encodeURIComponent(CryptoJS.AES.encrypt(encryptedString, process.env.EncryptedPass).toString())
}




exports.getPiaById = (req, res, ) => {
    const token = req.headers["x-access-token"]
    const id = req.body.id
    jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
        if (decoded.id) {
            User.findById(decoded.id, (error, user) => {
                let isOfficer = user.isOfficer
                if (!isOfficer){
                    existingPia.findById(id, (err, result) => {
                        if (err || decoded.id.toString() !== result.creatorId.toString()) {
                            res.json({
                                isSuccess: false,
                                error: err,
                                message: "Can not get pia from db",
                            })
                        } else {
                            if (result) {
                                res.json({
                                    isSuccess: true,
                                    Pia: result
                                })
                            }
                        }
                    })
                }
                else{
                    existingPia.findById(id, (err, result) => {
                        if (err) {
                            res.json({
                                isSuccess: false,
                                error: err,
                                message: "Can not get pia from db",
                            })
                        } else {
                            if (result) {
                                res.json({
                                    isSuccess: true,
                                    Pia: result
                                })
                            }
                        }
                    })
                }

            })
        }

    })
}


exports.login = async  (req, res) => {
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
}

exports.getAllPia = (req, res, ) => {
    const token = req.headers["x-access-token"]
    jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
        if (decoded.id){
            User.findById(decoded.id , (error, result) => {
                if (result === null){
                    res.json({
                        isSuccess: false,
                        error: error,
                        message: "Can not get user from db",
                    })
                } else if (error){
                    console.log(error)
                    res.json({
                        isSuccess: false,
                        error: error,
                        message: "Can not get all pia from db",
                    })
                }
                else{
                    if (result.isOfficer){
                        existingPia.find({}, (err, result) => {
                            if (err){
                                res.json({
                                    isSuccess: false,
                                    error: error,
                                    message: "Can not get all pia from db",
                                })
                            }
                            else{
                                if (result){
                                    res.json({
                                        isSuccess: true,
                                        allPia: result
                                    })
                                }
                            }
                        })
                    }
                    else{
                        existingPia.find({creatorId: decoded.id}, (error, result) => {
                            if (error){
                                res.json({
                                    isSuccess: false,
                                    error: error,
                                    message: "Can not get all pia from db",
                                })
                            }
                            else{
                                res.json({
                                    isSuccess: true,
                                    allPia: result
                                })
                            }
                        })
                    }
                }
            })
        }

    })
}

exports.isUserAuth = (req, res) => {
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
}

exports.deletePia = (req, res,) => {
    const token = req.headers["x-access-token"]
    const id = req.body.id
    let pia_name = "A PIA"
    jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
        if (decoded.id) {
            // Verify that user is privacy officer
            User.findById(decoded.id, (error, result) => {
                if (result === null) {
                    res.json({
                        isSuccess: false,
                        error: error,
                        message: "Can not get user from db",
                    })
                } if (!result.isOfficer) {
                    res.json({
                        isSuccess: false,
                        error: "PermissionError",
                        message: "User does not have delete permissions",
                    })
                } else {
                    existingPia.findById(id, (error, result) => {
                        if (error) {
                            res.json({
                                isSuccess: false,
                                message: "Unable to delete Pia",
                            })
                        }
                        else {
                            if (result) {
                                pia_name = result.pia.projectName
                                User.findById(result.creatorId, (error, result) => {
                                    if (error) {
                                        res.json({
                                            isSuccess: false,
                                            message: "Unable to delete Pia",
                                        })
                                    }
                                    else {
                                        if (result) {
                                            const recipients = [result.email]
                                            existingPia.deleteOne({ _id: id }).then((result) => {
                                                if (result.deletedCount === 1) {
                                                    res.json({
                                                        isSuccess: true,
                                                        message: "Successfully deleting Pia",
                                                    })
                                                    
                                                    setUpEmail(recipients, `DELETED: ${pia_name}`, `${pia_name} has been deleted.`, '', true, {})
                                                    
                                                }
                                                else {
                                                    res.json({
                                                        isSuccess: false,
                                                        message: "Unable to delete Pia",
                                                    })
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    })
}

exports.addNew = (req, res, ) => {
    const newPia = req.body.Pia
    const token = req.headers["x-access-token"]
    jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
        if (decoded.id){
            let insertedPia = new existingPia({
                pia: newPia,
                creatorId: decoded.id,
                status: "PENDING",
                date: new Date()
            })
            insertedPia.save((err, user) => {
                if (err) {
                    res.json({
                        isSuccess: false,
                        error: err,
                        message: "Can not save it in db",
                    })
                }
                else{
                    let encryptedId = encrypted(user._id.toString());
                    User.findById(decoded.id, async (error, user) => {
                        if (error){
                            res.json({
                                isSuccess: false,
                                error: err,
                                message: "Can not get User email",
                            })
                        }else{
                            if (user){
                                res.json({
                                    isSuccess: true,
                                    message: "Successfully submitted",
                                });                                                       
                                setUpEmail(await getPrivacyOfficers(), "New PIA", `A new Privacy Impact Assessment has been submitted by ${user.email}.`, `/editPia:${encryptedId}`, false, {});
                                
                            }
                        }
                    })
                }
            })
        }
    })
}

checkForEdit = (oldPia, editPia) => {
            console.log(`old: ${oldPia.pia.projectName}`)
            console.log(`new: ${editPia.projectName}`)
            
            if (oldPia.pia.projectName !== editPia.projectName) {
                return true;
            } else if (oldPia.pia.sponsoringBusinessUnit !== editPia.sponsoringBusinessUnit) {
                return true
            } else if (oldPia.pia.projectDescription !== editPia.projectDescription) {
                return true
            } else if (oldPia.pia.isCollected !== editPia.isCollected) {
                return true
            } else if (oldPia.pia.personalInfo !== editPia.personalInfo) {
                return true
            } else if (oldPia.pia.purpose !== editPia.purpose) {
                return true
            } else if (oldPia.pia.individualsInfo !== editPia.individualsInfo) {
                return true
            } else if (oldPia.pia.isDisclosed !== editPia.isDisclosed) {
                return true
            } else if (oldPia.pia.disclosedInfo !== editPia.disclosedInfo) {
                return true
            } else return false

}

exports.editPia = (req, res, ) => {
    const editPia = req.body.data.Pia
    const updatedId = req.body.data.id
    const newStatus = req.body.data.status
    const newComment = req.body.data.newComment
    const token = req.headers["x-access-token"]
    const encryptedId = encrypted(updatedId)
    let isEdit = false;
    let updatedObject
    if (newStatus === undefined){
         updatedObject = {
            pia: editPia,
            status: 'PENDING',
            piaId: updatedId, 
            encryptedId: encryptedId,
            newComment: newComment
        }
    }
    else{
         updatedObject = {
            pia: editPia,
            status: newStatus,
            piaId: updatedId,
            encryptedId: encryptedId,
            newComment: newComment
         }
    }
    jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
        if (decoded.id) {
             // verify that user has correct permissions
             User.findById(decoded.id, (error, result) => {
                if (result === null) {
                    res.json({
                        isSuccess: false,
                        error: error,
                        message: "Can not get user from db",
                    })
                } else if (!result.isOfficer && newStatus === 'APPROVED' || !result.isOfficer && newStatus === 'REJECTED') {
                    return res.json({
                        isSuccess: false,
                        error: "PermissionError",
                        message: "User does not have delete permissions",
                    })
                } else {
                    // get PIA and check fields
                    existingPia.findById(updatedId, (err, oldPia) => {
                        isEdit = checkForEdit(oldPia, editPia)
                        updatedObject.isEdit = isEdit
                        console.log(`is edit: ${updatedObject.isEdit}`)
                        existingPia.findByIdAndUpdate(updatedId, updatedObject, (err, updatedPia) => {
                            if (err || updatedPia === null) {
                                res.json({
                                    isSuccess: false,
                                    error: err,
                                    message: "Can not save it in db",
                                })
                            }
                            else{
                                res.json({
                                    isSuccess: true,
                                    message: "Successfully submitted",
                                })
                                // change date to yyyy-mm-dd
                                let date = updatedPia.createdAt.toString();
                                let newDate = new Date(date).toISOString().slice(0, 10);
                                updatedObject.createdAt = newDate;
                                setUpEdit(updatedObject, decoded.id, updatedPia.creatorId.toString());
                            }
                        })
                    })

                }
            })
        }
    })
}



exports.printPia = (req, res, ) => {
    const printedPia = req.body.Pia
    // console.log(JSON.stringify(printedPia));
    console.dir(printedPia, { depth: null });
    const token = req.headers["x-access-token"]

    jwt.verify(token, process.env.JWT_VAR, async (err, decoded) => {
        if (decoded.id && printedPia){
            try{
                let pdfSpecs = await setUpPdf(printedPia);
                console.log(pdfSpecs);
                
                pdf.create(pdfSpecs.dataForPDF, pdfSpecs.options).toFile('./test.pdf', async (err, user) => {
                    if (err) {
                        res.json({
                            isSuccess: false,
                            message: "Issue with printing Pia",
                        })
                    }
                    else{
                        var file = fs.createReadStream('./test.pdf');
                        var stat = fs.statSync('./test.pdf');
                        res.setHeader('Content-Length', stat.size);
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'attachment; filename=test.pdf');
                        file.pipe(res);                        
                    }
                });

            } catch(error){
                console.log(error);
                res.json({
                    isSuccess: false,
                    message: "Issue with printing Pia",
                })
            }
        }
    })
}


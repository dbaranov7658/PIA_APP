const nodemailer = require('nodemailer')
const ejs = require('ejs')
const User = require('../models/user')
const existingPia = require("../models/piaSchema");
const pdf = require('html-pdf');
const fs = require('fs');
const { setUpPdf } = require('../controllers/Api');
path = require('path')

var myCss = {
    style : fs.readFileSync('./printFunctionality/template.css','utf8'),
};

// Set up email transporter
const mailConfig1 = {
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
        user: "fortisbcpia@gmail.com",
        pass: "LJdk8123FYnb0QsD"
    }
};
// all emails are catched by ethereal.email
const mailConfig2 = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: "adell.lubowitz@ethereal.email",
        pass: "5UCdxN3WkKvNNAqsWS"
    }
};


let transporter = nodemailer.createTransport(mailConfig2);

// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");

    }
});

async function setUpEdit(updatedObject, triggerUserId, creatorId, createdAt) {
    // console.log(`new obj: ${updatedObject}`);
    let creatorEmail = "";
    let recipients = [];
    let piaName = updatedObject.pia.projectName;
    let piaId = updatedObject.encryptedId;
    let triggerUser = "";
    let triggerUserEmail = "";
     // find user, check if PO
     User.findById(triggerUserId, async (error, result) => {
        if (error) {
            return error;
        } else {
            triggerUserEmail = result.email;
            if (result.isOfficer) {
                triggerUser = 'privacyOfficer';
                
            } else {
                triggerUser = 'generalUser'
            }
        }
    })          

    try {
        // get email of creator
        let result = await User.findById(creatorId)     
        creatorEmail = result.email;
        recipients.push(creatorEmail);

        // check if there's new comments
        if (updatedObject.newComment) {
            console.log("new comment");
            // if PO notify user, else notify POs
            if (triggerUser === 'privacyOfficer') {
                // notify pia author
                // recipients.push(creatorEmail)
                setUpEmail(recipients, `New comment on ${piaName}`, `${triggerUserEmail} has left a comment on ${piaName}.`, `/editPia:${piaId}`, false, {})
            } else {
                console.log('user')
                // notify po
                setUpEmail( await getPrivacyOfficers(), `New comment to ${piaName}`, `${triggerUserEmail} has left a comment on ${piaName}.`, `/editPia:${piaId}`, false, {})
            }     
        }

        switch(updatedObject.status) {
            case 'PENDING':
                // if PO notify user, else notify POs
                if (triggerUser === 'privacyOfficer') {
                    // notify pia author
                    // recipients.push(creatorEmail)
                    setUpEmail(recipients, `New Edit Made to ${piaName}`, `${triggerUserEmail} has made an edit to ${piaName}.`, `/editPia:${piaId}`, false, {})
                } else {
                    console.log('user')
                    // notify po
                    setUpEmail( await getPrivacyOfficers(), `New Edit Made to ${piaName}`, `${triggerUserEmail} has made an edit to ${piaName}.`, `/editPia:${piaId}`, false, {})
                }                        
                break;
            case 'APPROVED':
                // generate pdf
                // const htmlPath = path.join(__dirname, "../printFunctionality/printTemplate.ejs")
                
                // let dataForPDF = await ejs.renderFile(htmlPath,{
                //     myCss: myCss,
                //     projectName: updatedObject.pia.projectName,
                //     sponsoringBusinessUnit: updatedObject.pia.sponsoringBusinessUnit,
                //     projectDescription: updatedObject.pia.projectDescription ? updatedObject.pia.projectDescription.replace(/['"]+/g, '') : '',
                //     isCollected: Boolean(updatedObject.pia.isCollected),
                //     personalInfo: updatedObject.pia.personalInfo ?  updatedObject.pia.personalInfo.replace(/['"]+/g, '')  : '',
                //     purpose: updatedObject.pia.purpose,
                //     individualsInfo: updatedObject.pia.individualsInfo ? updatedObject.pia.individualsInfo.replace(/['"]+/g, '')  : '',
                //     date: createdAt.slice(0, 10).toString(),
                //     isDisclosed: updatedObject.pia.isDisclosed,
                //     disclosedInfo: updatedObject.pia.disclosedInfo ? updatedObject.pia.disclosedInfo.replace(/['"]+/g, '')    : '',
                // },{async:true});

                
                // var pdfOptions = {
                //     // height: '842px', width: '595px',
                //     format: 'A4', type: "pdf",
                //     // "header": {"height": "10mm"},
                //     "footer": {"height": "10mm"}
                // };
                let pdfSpecs = setUpPdf(updatedObject);

                await pdf.create(pdfSpecs.dataForPDF, pdfSpecs.pdfOptions).toFile('./Emails/pia.pdf', async (err, user) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(`user: ${user}`);
                        var file = fs.createReadStream('./Emails/pia.pdf');
                        // path: path.join(__dirname, "/pia.pdf"),
                        file.on('open', function () {
                            let emailOptions = {
                                attachments: [{
                                    filename: "pia.pdf",
                                    content: file
                                }]
                            }
                            // recipients.push(creatorEmail)
                            setUpEmail(recipients, `APPROVED: ${piaName}`, `${piaName} has been approved.`, `/editPia:${piaId}`, false, emailOptions);
                        });
                        // fs.readFile(('./Emails/pia.pdf'), (err, data) => {
                        //     if (err) {
                        //       // do something with the error
                        //         console.log(err);
                        //     }
                        //     if (data) {
                        //         let emailOptions = {
                        //             attachments: [{
                        //                 encoding: 'base64',
                        //                 content: data.toString('base64'),
                        //                 contentType: 'application/pdf',
                        //                 contentDisposition: 'attachment',
                        //                 filename: 'pia.pdf'
                        //             }]
                        //         }
                        //         recipients.push(creatorEmail)
                        //         setUpEmail(recipients, `APPROVED: ${piaName}`, `${piaName} has been approved.`, `/editPia:${piaId}`, false, emailOptions);
                        //     }
                        // });
                        // let emailOptions = {
                        //     attachments: [{
                        //         filename: "pia.pdf",
                        //         path: path.join(__dirname, "pia.pdf"),
                        //         contentType: 'application/pdf'
                        //     }]
                        // }
                        // let emailOptions = {
                        //     attachments: [{
                        //         path: path.join(__dirname, "pia.pdf"),
                        //         contentDisposition: 'attachment; filename=test.pdf'
                        //     }]
                        // }
                        // console.log(emailOptions);

                        // recipients.push(creatorEmail)
                        // await setUpEmail(recipients, `APPROVED: ${piaName}`, `${piaName} has been approved.`, `/editPia:${piaId}`, false, emailOptions);
                    }
                });
                break;
            case 'REJECTED':
                console.log('rejected')
                // recipients.push(creatorEmail)
                console.log(recipients)
                setUpEmail( recipients, `REJECTED: ${piaName}`, `${piaName} has been rejected.`, `/editPia:${piaId}`, false, {});
                break;
            default:
                console.log(updatedObject);
        }

    } catch (error) {
        // res.json({
        //     isSuccess: false,
        //     error: error,
        // })
        // return error;
        console.log(error);
    }
    
}

async function getPrivacyOfficers() {
    try {
        let officers = await User.find({ isOfficer: 'true' });

        let officer_emails = [];
        officers.forEach(element => {
            officer_emails.push(element.email);
        });

        return officer_emails;
    } catch (err) {
        // res.json({
        //     status: false,
        //     message: 'Something went wrong'
        // })
        // console.log(err);
        return err;
    }
}


async function setUpEmail(recipients, subject, event_msg, pia_url, deleted, emailOptions) {
    let recipientNames = [];
    
    // get username of each recipient
    recipients.forEach(email => {
        recipientNames.push(email.substring(0, email.indexOf('@')));
    });

    const options = {
        from: process.env.NOTIF_EMAIL_USER,
        to: recipients,
        subject: subject,
        text: `${event_msg}`, // Fallback message
    }

    Object.assign(options, emailOptions);
    console.log(`options: ${options}`);


    try {
        recipientNames.forEach(name => {
            sendEmail(name, event_msg, options, pia_url, deleted).then((result) => {
                console.log(result)
            })
        });
    } catch (error) {
        // res.json({
        //     status: false,
        //     message: 'Something went wrong'
        // })
        // console.log(error);
        return error;
    }

    
}

async function sendEmail(recipient_name, event_msg, options, pia_url, deleted) {
    try {
        // remove controllers from __dirname
        // let _dirnames_arr = __dirname.split("/")
        // let c_index = _dirnames_arr.indexOf("controllers")
        // _dirnames_arr.splice(c_index, 1);
        // const _abs_dir = _dirnames_arr.join("/")

        let new_dir = __dirname.replace(/\\/g, "/")


        // render email template
        let data = await ejs.renderFile(path.join(__dirname + "/../views/email_template.ejs"), { recipient: recipient_name, event_msg: event_msg, pia_url: "http://localhost:3000" + pia_url, deleted: deleted});
        options.html = data;

        // send email
        let result = await transporter.sendMail(options);

        // get preview link of test email
        // if (process.env.NODE_ENV === 'development') {
        //     console.log('Preview URL: ' + nodemailer.getTestMessageUrl(result));
        // }

        return result;
    } catch(err) {
        return err
    }
}

module.exports = {
    getPrivacyOfficers,
    setUpEdit,
    setUpEmail,
    sendEmail
}

const nodemailer = require('nodemailer')
const ejs = require('ejs')
const User = require('../models/user')
const existingPia = require("../models/piaSchema");
const pdf = require('html-pdf');
const fs = require('fs');
const { setUpPdf } = require('../printFunctionality/pdfSetup');
path = require('path')

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

async function setUpEdit(updatedObject, triggerUserId, creatorId) {
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
            // if PO notify user, else notify POs
            if (triggerUser === 'privacyOfficer') {
                // notify pia author
                setUpEmail(recipients, `New comment on ${piaName}`, `${triggerUserEmail} has left a comment on ${piaName}.`, `/editPia:${piaId}`, false, {})
            } else {
                // notify po
                setUpEmail( await getPrivacyOfficers(), `New comment on ${piaName}`, `${triggerUserEmail} has left a comment on ${piaName}.`, `/editPia:${piaId}`, false, {})
            }     
        }

        switch(updatedObject.status) {
            case 'PENDING':
                // if PO notify user, else notify POs
                if (triggerUser === 'privacyOfficer') {
                    // notify pia author
                    setUpEmail(recipients, `New Edit Made to ${piaName}`, `${triggerUserEmail} has made an edit to ${piaName}.`, `/editPia:${piaId}`, false, {})
                } else {
                    // notify po
                    setUpEmail( await getPrivacyOfficers(), `New Edit Made to ${piaName}`, `${triggerUserEmail} has made an edit to ${piaName}.`, `/editPia:${piaId}`, false, {})
                }                        
                break;
            case 'APPROVED':
                // generate pdf
                let specs = await setUpPdf(updatedObject);

                pdf.create(specs.dataForPDF, specs.pdfOptions).toFile(`./Emails/${piaName}.pdf`, async (err, user) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        // attach to email
                        let emailOptions = {
                            attachments: [{
                                path: path.join(__dirname, `${piaName}.pdf`),
                            }]
                        }
                        await setUpEmail(recipients, `APPROVED: ${piaName}`, `${piaName} has been approved.`, `/editPia:${piaId}`, false, emailOptions);
                    }
                });
                break;
            case 'REJECTED':
                setUpEmail( recipients, `REJECTED: ${piaName}`, `${piaName} has been rejected.`, `/editPia:${piaId}`, false, {});
                break;
            default:
                console.log(updatedObject);
        }

    } catch (error) {
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


    try {
        recipientNames.forEach(name => {
            sendEmail(name, event_msg, options, pia_url, deleted).then((result) => {
                console.log(result)
            })
        });
    } catch (error) {
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

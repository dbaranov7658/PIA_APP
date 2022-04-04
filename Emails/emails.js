const nodemailer = require('nodemailer')
const ejs = require('ejs')
const User = require('../models/user')
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
    // console.log(`new obj: ${updatedObject}`);
    let creatorEmail = "";
    let recipients = [];
    let piaName = updatedObject.pia.projectName;
    let piaId = updatedObject.encryptedId;

    try {
        // get email of creator
        let result = await User.findById(creatorId)     
        // creatorEmail.push(result.email);
        creatorEmail = result.email;
            
       

        switch(updatedObject.status) {
            case 'PENDING':
                // find user, check if PO
                User.findById(triggerUserId, async (error, result) => {
                    if (error) {
                        res.json({
                            isSuccess: false,
                            error: error,
                            message: "Can not find user",
                        })
                    } else {
                        if (result.isOfficer) {
                            // notify pia author
                            recipients.push(creatorEmail)
                            setUpEmail(recipients, `New Edit Made to ${piaName}`, `${result.email} has made an edit to ${piaName}.`, `/editPia:${piaId}`, false)
                            
                        } else {
                            console.log('user')
                            // notify po
                
                            setUpEmail( await getPrivacyOfficers(), `New Edit Made to ${piaName}`, `${result.email} has made an edit to ${piaName}.`, `/editPia:${piaId}`, false)
                        }
                    }
                })            
                break;
            case 'APPROVED':
                // generate pdf
        
                recipients.push(creatorEmail)
                console.log(recipients)
                setUpEmail( recipients, `APPROVED: ${piaName}`, `${piaName} has been approved.`, `/editPia:${piaId}`, false);
                break;
            case 'REJECTED':
                console.log('rejected')
                console.log(creatorEmail)
                recipients.push(creatorEmail)
                console.log(recipients)
                setUpEmail( recipients, `REJECTED: ${piaName}`, `${piaName} has been rejected.`, `/editPia:${piaId}`, false);
                break;
            default:
                console.log(updatedObject);
        }

    } catch (error) {
        res.json({
            isSuccess: false,
            error: error,
        })
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
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}


async function setUpEmail(recipients, subject, event_msg, pia_url, deleted) {
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

    try {
        recipientNames.forEach(name => {
            sendEmail(name, event_msg, options, pia_url, deleted).then((result) => {
                console.log(result)
            })
        });
    } catch (error) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(error);
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

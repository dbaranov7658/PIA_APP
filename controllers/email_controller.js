const nodemailer = require('nodemailer')
const ejs = require('ejs')
const User = require('../models/user')

// Set up email transporter
const mailConfig1 = {
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
            user: process.env.NOTIF_EMAIL_USER,
            pass: process.env.SMTP_KEY
        }
};
// all emails are catched by ethereal.email
const mailConfig2 = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.ETHEREAL_EMAIL,
        pass: process.env.ETHEREAL_PWD
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


/**
 * Gets all privacy officers from the database
 * @returns array of officer_emails
 */
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

/* 
 * Sends email to privacy officers
 * @route  v1/email/emailNewPia/:user_email
 * @type   POST 
 * @access public
 */
exports.emailNewPia = async (req, res) => {
    try {
        const user_email = req.params.user_email

        // get url from db
        const pia_url = "http://localhost:3000";

        // get all POs from db
        const recipients = await getPrivacyOfficers();
        const recipient_role = "Privacy Officer";
        const event_msg = `A new Privacy Impact Assessment has been submitted by ${user_email}.`;
        
        const options = {
            from: process.env.NOTIF_EMAIL_USER,
            to: recipients,
            subject: "New PIA",
            text: `${event_msg}`, // Fallback message
        }

        let result = await sendEmail(req, res, recipient_role, pia_url, event_msg, options);
        res.json({
            status: true,
            message: 'Email sent',
            recipient_role: recipient_role,
            result: result
        })

    } catch (err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}

/* 
 * Sends email to privacy officers (if general user commented)
 * Sends email to general user (if privacy officer commented)
 * @route  v1/email/emailCommentPia/:user_email
 * @type   POST 
 * @access public
 */
exports.emailCommentPia = async (req, res) => {
    try {
        const user_email = req.params.user_email;

        // get url from db
        const pia_url = "http://localhost:3000";

        // get name of pia from db
        const pia_name = "PIA #1";

        // get pia users from db
        const general_user = "userfortisbc@outlook.com";
        let recipients = []
        let recipient_role = ""; 

        if (user_email === general_user) { // later: check if isOfficer
            // get all po's from db
            recipients = await getPrivacyOfficers();
            recipient_role = "Privacy Officer";
        } else {
            recipients.push(general_user);
            recipient_role = "General User";
        }

        // configure email params
        const event_msg = `${user_email} has left a comment on ${pia_name}`;
        const options = {
            from: process.env.NOTIF_EMAIL_USER,
            to: recipients,
            subject: `New comment on ${pia_name}`,
            text: `${event_msg}`, // Fallback message
        }

        let result = await sendEmail(req, res, recipient_role, pia_url, event_msg, options);
        res.json({
            status: true,
            message: 'Email sent',
            recipient_role: recipient_role,
            result: result,
        })

    } catch (err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}

/* 
 * Sends email to privacy officers
 * @route  v1/email/emailEditPia/:user_email
 * @type   POST 
 * @access public
 */
exports.emailEditPia = async (req, res) => {
    try {
        const user_email = req.params.user_email;

        // get url from db
        const pia_url = "http://localhost:3000";

        // get name of pia from db
        const pia_name = "PIA #1";

        const recipients = await getPrivacyOfficers();
        const recipient_role = "Privacy Officer";
        const event_msg = `${user_email} has made an edit to ${pia_name}.`;
        
        const options = {
            from: process.env.NOTIF_EMAIL_USER,
            to: recipients,
            subject: `New Edit Made to ${pia_name}`,
            text: `${event_msg}`, // Fallback message
        }

        let result = await sendEmail(req, res, recipient_role, pia_url, event_msg, options);
        res.json({
            status: true,
            message: 'Email sent',
            recipient_role: recipient_role,
            result: result
        })

    } catch (err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}

/* 
 * Sends email to general user
 * @route  v1/email/emailEditPia
 * @type   POST 
 * @access public
 */
exports.emailApprovePia = async (req, res) => {
    try {
        // get url from db
        const pia_url = "http://localhost:3000";

        // get name of pia from db
        const pia_name = "PIA #1";

        // get pia user from db
        const recipient_email = "userfortisbc@outlook.com";
        const recipient_role = "General User"

        const event_msg = `${pia_name} has been approved.`;
        
        const options = {
            from: process.env.NOTIF_EMAIL_USER,
            to: recipient_email,
            subject: `APPROVED: ${pia_name}`,
            text: `${event_msg}`, // Fallback message
        }

        let result = await sendEmail(req, res, recipient_role, pia_url, event_msg, options);
        res.json({
            status: true,
            message: 'Email sent',
            recipient_role: recipient_role,
            result: result
        })
    } catch (err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}

/* 
 * Sends email to general user
 * @route  v1/email/emailRejectPia
 * @type   POST 
 * @access public
 */
exports.emailRejectPia = async (req, res) => {
    try {
        // get url from db
        const pia_url = "http://localhost:3000";

        // get name of pia from db
        const pia_name = "PIA #1";

        // get pia user from db
        const recipient_email = "userfortisbc@outlook.com";
        const recipient_role = "General User"

        const event_msg = `${pia_name} has been rejected.`;
        
        const options = {
            from: process.env.NOTIF_EMAIL_USER,
            to: recipient_email,
            subject: `REJECTED: ${pia_name}`,
            text: `${event_msg}`, // Fallback message
        }
        let result = await sendEmail(req, res, recipient_role, pia_url, event_msg, options);
        res.json({
            status: true,
            message: 'Email sent',
            recipient_role: recipient_role,
            result: result
        })
    } catch (err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}

/* 
 * Sends email to general user
 * @route  v1/email/emailDeletePia
 * @type   POST 
 * @access public
 */
exports.emailDeletePia = async (req, res) => {
    try {
        // get url from db
        const pia_url = "http://localhost:3000";

        // get name of pia from db
        const pia_name = "PIA #1";

        // get pia user from db
        const recipient_email = "userfortisbc@outlook.com";
        const recipient_role = "General User"

        const event_msg = `${pia_name} has been deleted.`;
        
        const options = {
            from: process.env.NOTIF_EMAIL_USER,
            to: recipient_email,
            subject: `DELETED: ${pia_name}`,
            text: `${event_msg}`, // Fallback message
        }
        let result = await sendEmail(req, res, recipient_role, pia_url, event_msg, options);
        res.json({
            status: true,
            message: 'Email sent',
            recipient_role: recipient_role,
            result: result
        })
    } catch (err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}


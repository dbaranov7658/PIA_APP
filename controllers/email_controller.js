const nodemailer = require('nodemailer')
const ejs = require('ejs')



// Set up email transporter
const transporter = nodemailer.createTransport({
    // host: "smtp-relay.sendinblue.com ",
    // port: 587,
    // service: 'SendinBlue',
    service: "Gmail",
    auth: {
        user: process.env.NOTIF_EMAIL_USER,
        pass: process.env.NOTIF_EMAIL_PWD
    }
})

// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
});

async function sendEmail(req, res, recipient_name, pia_url, event_msg, options) {
    try {
        // remove controllers from __dirname
        let _dirnames_arr = __dirname.split("/")
        let c_index = _dirnames_arr.indexOf("controllers")
        _dirnames_arr.splice(c_index, 1);
        const _abs_dir = _dirnames_arr.join("/")

        // render email template
        let data = await ejs.renderFile(_abs_dir + "/views/email_template.ejs", { recipient: recipient_name, event_msg: event_msg, pia_url: pia_url });
        options.html = data;

        // send email
        let result = await transporter.sendMail(options);
        console.log(result);
        res.json({
            status: true,
            message: 'Email sent'
        })    
        
    } catch(err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}


/* 
 * @route  v1/email/emailNewPia/:user_email
 * @type   POST 
 * @access public
 */
exports.emailNewPia = (req,res) => {
    const user_email = req.params.user_email.substring(1);

    // get url from db
    const pia_url = "http://localhost:3000";

    const recipient = process.env.PO_EMAIL;
    const event_msg = `A new Privacy Impact Assessment has been submitted by ${user_email}.`;
    
    const options = {
        from: process.env.NOTIF_EMAIL_USER,
        to: recipient,
        subject: "New PIA",
        text: `${event_msg} Click to view: ${pia_url}`, // Fallback message
    }
    sendEmail(req, res, "Privacy Officer", pia_url, event_msg, options);
}

/* 
 * @route  v1/email/emailCommentPia/:user_email
 * @type   POST 
 * @access public
 */
exports.emailCommentPia = (req,res) => {
    const user_email = req.params.user_email.substring(1);

    // get url from db
    const pia_url = "http://localhost:3000";

    // get name of pia from db
    const pia_name = "PIA #1";

    // get pia users from db
    const general_user = "userfortisbc@outlook.com";
    const privacy_officer = process.env.PO_EMAIL;
    const recipient_email = user_email === privacy_officer ? general_user : privacy_officer; 
    const recipient_name = user_email === privacy_officer ? "General User" : "Privacy Officer"; 

    const event_msg = `${user_email} has left a comment on ${pia_name}`;
    const options = {
        from: process.env.NOTIF_EMAIL_USER,
        to: recipient_email,
        subject: `New comment on ${pia_name}`,
        text: `${event_msg} Click to view: ${pia_url}`, // Fallback message
    }
    sendEmail(req, res, recipient_name, pia_url, event_msg, options);
}

/* 
 * @route  v1/email/emailEditPia/:user_email
 * @type   POST 
 * @access public
 */
exports.emailEditPia = (req,res) => {
    const user_email = req.params.user_email.substring(1);

    // get url from db
    const pia_url = "http://localhost:3000";

    // get name of pia from db
    const pia_name = "PIA #1";

    const recipient_email = process.env.PO_EMAIL;
    const event_msg = `${user_email} has made an edit to ${pia_name}.`;
    
    const options = {
        from: process.env.NOTIF_EMAIL_USER,
        to: recipient_email,
        subject: `New Edit Made to ${pia_name}`,
        text: `${event_msg} Click to view: ${pia_url}`, // Fallback message
    }
    sendEmail(req, res, "Privacy Officer", pia_url, event_msg, options);
}

/* 
 * @route  v1/email/emailEditPia
 * @type   POST 
 * @access public
 */
exports.emailApprovePia = (req,res) => {
    // get url from db
    const pia_url = "http://localhost:3000";

    // get name of pia from db
    const pia_name = "PIA #1";

    // get pia user from db
    const recipient_email = "userfortisbc@outlook.com";
    const recipient_name = "General User"

    const event_msg = `${pia_name} has been approved.`;
    
    const options = {
        from: process.env.NOTIF_EMAIL_USER,
        to: recipient_email,
        subject: `APPROVED: ${pia_name}`,
        text: `${event_msg} Click to view: ${pia_url}`, // Fallback message
    }
    sendEmail(req, res, recipient_name, pia_url, event_msg, options);
}

/* 
 * @route  v1/email/emailRejectPia
 * @type   POST 
 * @access public
 */
exports.emailRejectPia = (req,res) => {
    // get url from db
    const pia_url = "http://localhost:3000";

    // get name of pia from db
    const pia_name = "PIA #1";

    // get pia user from db
    const recipient_email = "userfortisbc@outlook.com";
    const recipient_name = "General User"

    const event_msg = `${pia_name} has been rejected.`;
    
    const options = {
        from: process.env.NOTIF_EMAIL_USER,
        to: recipient_email,
        subject: `REJECTED: ${pia_name}`,
        text: `${event_msg} Click to view: ${pia_url}`, // Fallback message
    }
    sendEmail(req, res, recipient_name, pia_url, event_msg, options);
}


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
        user: process.env.ETHEREAL_EMAIL,
        pass: process.env.ETHEREAL_PWD
    }
};


let transporter = nodemailer.createTransport(mailConfig1);

// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");

    }
});


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

async function sendEmail(recipient_name, event_msg, options) {
    try {
        // remove controllers from __dirname
        // let _dirnames_arr = __dirname.split("/")
        // let c_index = _dirnames_arr.indexOf("controllers")
        // _dirnames_arr.splice(c_index, 1);
        // const _abs_dir = _dirnames_arr.join("/")

        let new_dir = __dirname.replace(/\\/g, "/")


        // render email template
        let data = await ejs.renderFile(path.join(__dirname + "/../views/email_template.ejs"), { recipient: recipient_name, event_msg: event_msg});
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
    sendEmail
}
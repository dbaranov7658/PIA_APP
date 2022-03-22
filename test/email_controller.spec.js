// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('../index');
// const emails = require('../routes/email_route')
// const emailController = require('../controllers/email_controller');
// const { expect } = require('chai');
// const should = chai.should; 
// // const should = require('should');

// chai.use(chaiHttp);

// // wait for server to start
// before(function (done) {
//     console.log("before is called");
//     server.on("app_started", function () {
//         done();
//     });
// });

// describe('Emails', function () {
//     // wait for email transporter to set up
//     before(function (done) {
//         server.on("messages_ready", function(){
//             done();
//         });
//     });

//     const trigger_email = process.env.ETHEREAL_EMAIL;

//     describe('emailNewPia', () => {
//         // new pia (good input)
//         it('should send a notification email to the privacy officer on a successful POST request for /emailNewPia', function (done) {
//             // chai.request(server).post(`http://localhost:3000/v1/email/emailNewPia/pofortis@outlook.com`).end(function (err, res) {
//             chai.request(emails).post({ path: 'http://localhost:3000/v1/email/emailApprovePia', port: 3000}).end(function (err, res) { 
//             // chai.request(server).post(`/emailNewPia/:${trigger_email}`).send({'user_email': trigger_email}).end(function (err, res) {
//             // // chai.request(server).post(`v1/email/emailApprovePia`).end(function (err, res) {
//             // chai.request(server).get('/login').end(function (err, res) { 
//                 if (err) {
//                     throw err;
//                 }
//                 console.log(`response: ${res.status}`);
//                 // res.should.have.status(200);
//             //     // res.should.be.json;
//             //     // res.body.should.be.a('array');
//                 done();
//             })
//         })

//         // new pia (bad input)
//     })

//     // comment pia (good input)

//     // comment pia (bad input)

//     // edit pia (good input)

//     // edit pia (bad input)

//     // approve pia 

//     // reject pia 

// })
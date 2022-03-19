// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('../index');
// const emails = require('../routes/email_route')
// const should = chai.should; 
// // const should = require('should');

// chai.use(chaiHttp);

// // wait for server to start
// before(function (done) {
//     console.log("before is called");
//     server.on("app_started", function () {
//         // server.on("messages_ready", function(){
//             done();
//         // });
//     });
// });

// describe('Emails', function () {
//     let trigger_email = process.env.ETHEREAL_EMAIL;
//     // new pia (good input)
//     it('should send a notification email to the privacy officer on a successful POST request for /emailNewPia', function (done) {
//         chai.request(server).post(`v1/email/emailNewPia/:${trigger_email}`).end(function (err, res) {   
//             console.log(`response: ${res}`);
//             // res.should.have.status(200);
//             // res.should.be.json;
//             // res.body.should.be.a('array');
//             // res.body[0].trigger_email.should.equal(trigger_email);
//             done();
//         })
//     })
// })
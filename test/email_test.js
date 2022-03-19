const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const emails = require('../routes/email_route')
const emailController = require('../controllers/email_controller')
const should = chai.should; 
// const should = require('should');

chai.use(chaiHttp);

// wait for server to start
before(function (done) {
    console.log("before is called");
    server.on("app_started", function () {
        // server.on("messages_ready", function(){
            done();
        // });
    });
});

describe('Emails', function () {
    before(function (done) {
        server.on("messages_ready", function(){
            done();
        });
    });
    let trigger_email = process.env.ETHEREAL_EMAIL;
    // new pia (good input)
    it('should send a notification email to the privacy officer on a successful POST request for /emailNewPia', function (done) {
        const req = {
            params: {
              user_email: trigger_email,
            },
          };
        emailController.emailApprovePia();
        console.log(res);
        // chai.request(server).post(`emailNewPia/:${trigger_email}`).end(function (err, res) {
        // chai.request(server).post(`/emailNewPia/:${trigger_email}`).send({'user_email': trigger_email}).end(function (err, res) {
        // // chai.request(server).post(`v1/email/emailApprovePia`).end(function (err, res) { 
        // // chai.request(server).get('/').end(function (err, res) { 
        //     console.log(`response: ${res.text}`);
        //     // res.should.have.status(200);
        //     // res.should.be.json;
        //     // res.body.should.be.a('array');
        //     // res.body[0].trigger_email.should.equal(trigger_email);
        //     done();
        // })
    })
})
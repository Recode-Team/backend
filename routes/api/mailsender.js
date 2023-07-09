const nodeMailer = require("nodemailer");
const express = require("express");
const {MAIL_ID, MAIL_PASSWORD} = process.env;

const router = express.Router();

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: { user: MAIL_ID, pass: MAIL_PASSWORD },
})

// send mail code
router.post("/", function(req, res, next){
  let email = req.body.email;
  let result = {"results":{}, "status":""};
  let key = Math.random().toString(36).substring(2, 12).toUpperCase();

  let mailOptions = {
    from: MAIL_ID,
    to: email,
    subject: 'recode 가입 인증번호 관련 메일 드립니다',
    html: 
      "<span style='color: #348fe2;'>인증번호</span> 안내입니다."+
      "<p style='font-size: 16px; line-height: 26px; margin-top: 20px; padding: 0 5px;'>"+
      "안녕하세요.<br />"+
      "요청하신 인증번호가 생성되었습니다.<br />"+
      "recode 가입 화면에 입력해주세요.<br />"+
      "감사합니다.<br /><br />"+
      "</p>"+
      "인증번호: <br />"+
      "<span style='font-size: 24px;'>"+ key +"</span><br /><br />"+

      "recode 팀 드림"
      ,
  }
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      result['results'] = { "key" : false }
      result['status']  = "bad request"
      res.status(400).send(result);
    }
    else {
      console.log('Email sent: ' + info.response);
      result['results'] = { "key" : key }
      result['status']  = "ok"
      res.status(200).send(result);
    }
  });
  // res.redirect("/");
})

module.exports = router;
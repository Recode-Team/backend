const nodeMailer = require("nodemailer");
const express = require("express");
const {MAIL_ID, MAIL_PASSWORD, JWT_KEY, SHA_KEY, SERVER_IP, SERVER_PORT} = process.env;
const jwt = require('jsonwebtoken');
const sequelize = require("../../../models/index");
const verifyToken = require('../../../token/verifyToken');
const crypto = require('crypto');

const router = express.Router();

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: { user: MAIL_ID, pass: MAIL_PASSWORD },
})

async function mailContext(receiverEmail, mailType, groupInvite) {
  let return_json = {
    "key": '',
    "mailOptions": {}
  }
  return_json["mailOptions"] = {
    from: MAIL_ID,
    to: receiverEmail,
    subject: 'recode 가입 인증번호 관련 메일 드립니다',
    html: "127.0.0.1"
  }
  
  if (mailType == 'register') {
    let key = Math.random().toString(36).substring(2, 12).toUpperCase();
    return_json["mailOptions"]["html"] += "<span style='color: #348fe2;'>인증번호</span> 안내입니다."+
      "<p style='font-size: 16px; line-height: 26px; margin-top: 20px; padding: 0 5px;'>"+
      "안녕하세요.<br />"+
      "요청하신 인증번호가 생성되었습니다.<br />"+
      "FlowMeet 가입 화면에 입력해주세요.<br />"+
      "감사합니다.<br /><br />"+
      "</p>"+ "인증번호: <br />"+ "<span style='font-size: 24px;'>"+ key +"</span><br /><br />"+
      "recode 팀 드림"
    return_json["key"] += key
    console.log(return_json)
  }
  else if (mailType == 'group')
  {
    console.log(groupInvite['groupInviteUrl'] )
    return_json["mailOptions"]["html"] += "<span style='color: #348fe2;'>인증번호</span> 안내입니다."+
      "<p style='font-size: 16px; line-height: 26px; margin-top: 20px; padding: 0 5px;'>"+
      "안녕하세요. FlowMeet을 이용해주셔서 감사합니다!<br />"+
      "그룹" + groupInvite['groupName'] + "에서 초대 요청이 왔습니다.<br />"+
      "아래의 링크를 누르면 자동 수락됩니다.<br /> <br />"+
      "<a href=" + groupInvite['groupInviteUrl'] + ">INVITE GROUP</a> <br />" +
      "recode 팀 드림"
  }

  return return_json
}

// send mail code
router.post("/", verifyToken, async(req, res, next) => {
  let receiverEmail = req.body.email;
  let mailType = req.body.type;
  let groupId = req.body.groupId; // default value is undefined
  let result = {"results":{}, "status":""};
  inviteApiUrl = "http://" + SERVER_IP +":"+ SERVER_PORT.toString() + '/api/groupuser'
  groupInvite = {
    "groupName": "",
    "groupInviteUrl": "",
    "groupId": groupId,
    "groupInviteToken": ""
  }

  jwt.verify(token, JWT_KEY, async (err, decoded) => {
    if (err) {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      const { name: email, nickname: userName } = decoded;
      if (groupId != undefined){
        let groupStatus = await sequelize.group.findOne({
            where: {
              id: groupId
            }
          })
          if (groupStatus) {
            console.log(receiverEmail)
            console.log(groupStatus)
            groupInvite['groupInviteToken'] = jwt.sign({
              type: 'JWT',
              senderEmail: email,
              receiverEmail: receiverEmail,
              groupId: groupId
            }, JWT_KEY, {
              expiresIn: '30m', // 만료시간 30분
              issuer: 'yhw',
            });
            groupInvite['groupname'] = groupStatus['groupname']
            groupInvite['groupInviteUrl'] = inviteApiUrl+"?groupToken="+ groupInvite['groupInviteToken']
          }
      }

      mailData = await mailContext(receiverEmail, mailType, groupInvite)
      .catch( err => {
        console.log(err)
      })
      
      console.log(groupInvite)
      transporter.sendMail(mailData['mailOptions'], function(error, info){
        if (error) {
          console.error("ERROR:", error);
          result['results'] = { "key" : false }
          result['status']  = "bad request"
          res.status(400).send(result);
        }
        else {
          console.log('Email sent: ' + info.response);
          result['results'] = { "key" : mailData['key'] }
          result['status']  = "ok"
          res.status(200).send(result);
        }
      });
    }
  });

  // res.redirect("/");
})

module.exports = router;
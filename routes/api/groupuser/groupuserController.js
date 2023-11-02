const express = require('express');
const jwt = require('jsonwebtoken');
const sequelize = require('../../../models/index');
const verifyToken = require('../../../token/verifyToken');
const { JWT_KEY } = process.env;

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const groupToken = req.query.groupToken;

    jwt.verify(groupToken, JWT_KEY, async (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        const { senderEmail: sender, receiverEmail: receiver, groupId: groupId } = decoded; // 토큰에서 사용자 이름 추출
        const userData = await sequelize.user.findOne({
          where:{
            email: receiver
          }
        });
        if (!userData){
          res.status(404).json({ status: 'not found user' });
        }
        else {
        const groupuser = await sequelize.groupuser.create({
          group_id: groupId,
          email: receiver, 
          name: userData['name']
        })
        .catch( err => {
          console.log(err)
        });
        if (!userData){
          res.status(404).json({ status: 'not found user' });
        }
        res.status(200).json({ status: 'ok', massage: "Success group invite user" });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create groupuser' });
  }
});


module.exports = router;
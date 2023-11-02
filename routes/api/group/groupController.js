const express = require('express');
const jwt = require('jsonwebtoken');
const sequelize = require('../../../models/index');
const verifyToken = require('../../../token/verifyToken');
const { JWT_KEY } = process.env;

const router = express.Router();

// create
router.post('/', verifyToken, async (req, res) => {
  try {
    const { groupname, groupcomment } = req.body;
    const token = req.headers.authorization.split(' ')[0];

    console.log(token);
    jwt.verify(token, JWT_KEY, async (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        const { name: email, nickname: userName } = decoded; // 토큰에서 사용자 이름 추출
        const groupStatus = await sequelize.group.create({
          groupname,
          groupcomment,
          creator: email, // 사용자 이름을 creator 필드에 할당
        });
        const groupuesr = await sequelize.groupuser.create({
          group_id: groupStatus.id,
          email: email,
          name: userName,
        });
        res.status(200).json({ status: 'ok' });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// read
router.get('/', verifyToken, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[0]; // 토큰을 헤더에서 추출

    jwt.verify(token, JWT_KEY, async (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        const { name: email } = decoded; // 토큰에서 사용자 이름 추출

        const group = await sequelize.groupuser.findAll({
          where: {
            email: email,
          },
        });

        if (!group) {
          res.status(404).json({ error: 'Group not found' });
        } else {
          res.status(200).json(group);
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

// update
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const groupId = req.params.id;
    const { groupname, groupcomment } = req.body;
    const token = req.headers.authorization.split(' ')[0]; // 토큰을 헤더에서 추출

    jwt.verify(token, JWT_KEY, async (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        const { name: userName } = decoded; // 토큰에서 사용자 이름 추출

        const updatedGroup = await sequelize.group.update(
          {
            groupname,
            groupcomment,
          },
          {
            where: {
              id: groupId,
              creator: userName,
            },
          }
        );

        if (updatedGroup[0] === 0) {
          res.status(404).json({ error: 'Group not found' });
        } else {
          res.status(200).json({ state: 'ok' });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update group' });
  }
});

// delete
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const groupId = req.params.id;
    const token = req.headers.authorization.split(' ')[0]; // 토큰을 헤더에서 추출

    jwt.verify(token, JWT_KEY, async (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        const { name: userName } = decoded; // 토큰에서 사용자 이름 추출

        // 그룹 삭제
        const deletedGroup = await sequelize.group.destroy({
          where: {
            id: groupId,
            creator: userName,
          },
        });
        const deletedGroupUser = await sequelize.groupuser.destroy({
          where: {
            group_id: groupId,
          },
        });
        const deletedGroupAlarm = await sequelize.groupalarm.destroy({
          where: {
            group_id: groupId,
          },
        });
        const deletedGroupMinute = await sequelize.minutes.destroy({
          where: {
            group_id: groupId,
          },
        });
        const deletedGroupChatting = await sequelize.chatting.destroy({
          where: {
            group_id: groupId,
          },
        });
        const deletedGroupBoard = await sequelize.board.destroy({
          where: {
            group_id: groupId,
          },
        });
        if (deletedGroup === 0) {
          res.status(404).json({ error: 'Group not found' });
        } else {
          res.status(200).json({ state: 'ok' });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

module.exports = router;

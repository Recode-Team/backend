const express = require('express');
const jwt = require('jsonwebtoken');
const sequelize = require('../../../models/index');
const verifyToken = require('../../../token/verifyToken');
const { JWT_KEY } = process.env;

const router = express.Router();

// create
router.post('/', verifyToken, async (req, res) => {
  try {
    const { id, boardname, boardcomment } = req.body;
    const token = req.headers.authorization.split(' ')[0];

    console.log(token);
    jwt.verify(token, JWT_KEY, async (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        const { name: email, nickname: userName } = decoded; // 토큰에서 사용자 이름 추출
        const board = await sequelize.board.create({
          group_id: id,
          boardname,
          boardcomment,
          creator: email,
        });
        res.status(200).json({ status: 'ok' });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create board' });
  }
});

// read
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[0]; // 토큰을 헤더에서 추출

    jwt.verify(token, JWT_KEY, async (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        // const { groupid: groupId } = decoded; // 토큰에서 사용자 이름 추출
        const id = req.params.id;

        const board = await sequelize.board.findAll({
          where: {
            group_id: id,
          },
        });

        if (!board) {
          res.status(404).json({ error: 'Board not found' });
        } else {
          res.status(200).json(board);
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

// update
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const groupId = req.params.id;
    const { boardname, boardcomment } = req.body;
    const token = req.headers.authorization.split(' ')[0]; // 토큰을 헤더에서 추출

    jwt.verify(token, JWT_KEY, async (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        const { name: userName } = decoded; // 토큰에서 사용자 이름 추출

        const updatedBoard = await sequelize.board.update(
          {
            boardname,
            boardcomment,
          },
          {
            where: {
              id: groupId,
              creator: userName,
            },
          }
        );

        if (updatedGroup[0] === 0) {
          res.status(404).json({ error: 'Board not found' });
        } else {
          res.status(200).json({ state: 'ok' });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update board' });
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

        const deletedGroupBoard = await sequelize.board.destroy({
          where: {
            group_id: groupId,
          },
        });
        if (deletedGroupBoard === 0) {
          res.status(404).json({ error: 'Board not found' });
        } else {
          res.status(200).json({ state: 'ok' });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

module.exports = router;

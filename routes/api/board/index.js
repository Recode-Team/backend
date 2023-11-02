const express = require('express');
const router = express.Router();

const api = {
  board: require('./boardController'),
};

router.use('/', api.board);

module.exports = router;

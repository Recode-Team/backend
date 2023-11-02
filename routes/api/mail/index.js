const express = require('express');
const router = express.Router();

const api = {
  mail: require('./mailSender'),
};

router.use('/', api.mail);

module.exports = router;
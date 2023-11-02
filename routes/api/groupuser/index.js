const express = require('express');
const router = express.Router();

const api = {
    groupuser: require('./groupuserController'),
};

router.use('/', api.groupuser);

module.exports = router;
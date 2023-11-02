// Recode\Backend\routes\index.js

const express = require('express');
const router = express();

const api = {
  loginRouter: require('./api/login'),
  registerRouter: require('./api/register'),
  groupRouter: require('./api/group/index'),
  groupuserRouter: require('./api/groupuser/index'),
  boardRouter: require('./api/board/index'),
  minutesRouter: require('./api/minutes/index'),
  mailRouter: require('./api/mail/index')
};

router.use('/api/login', api.loginRouter);
router.use('/api/register', api.registerRouter);
router.use('/api/group', api.groupRouter);
router.use('/api/groupuser', api.groupuserRouter)
router.use('/api/board', api.boardRouter);
router.use('/api/minutes', api.minutesRouter);
router.use('/api/mail', api.mailRouter)

module.exports = router;

// Recode\Backend\routes\index.js

const express = require("express");
const router = express();

const api = {
    loginRouter: require("./api/login"),
    registerRouter: require("./api/register"),
    mailRouter: require('./api/mailsender'),
    groupRouter: require('./api/group/index')
};

const minutesRouter = require('./api/minutes/index');

router.use("/api/login", api.loginRouter);
router.use("/api/register", api.registerRouter);
router.use("/api/sendmail", api.mailRouter);
router.use("/api/group", api.groupRouter);
router.use("/api/minutes", minutesRouter);

module.exports = router;

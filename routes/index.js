// Recode\Backend\routes\index.js

const express = require("express");
const router = express();

const api = {
    loginRouter: require("./api/login"),
    registerRouter: require("./api/register"),
    mailRouter: require('./api/mailsender'),
    groupRouter: require('./api/group/index'),
    createMinutesRouter: require('./api/chatGPT/minutes/create'),
    updateMinutesRouter: require('./api/chatGPT/minutes/update')
};

router.use("/api/login", api.loginRouter);
router.use("/api/register", api.registerRouter);
router.use("/api/sendmail", api.mailRouter);
router.use("/api", api.groupRouter);
router.use("/api/gpt/minutes/create", api.createMinutesRouter);
router.use("/", api.updateMinutesRouter);

module.exports = router;

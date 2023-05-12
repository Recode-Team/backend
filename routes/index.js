const express = require("express");
const router = express();

const api = {
    loginRouter: require("./api/login"),
    registerRouter: require("./api/register"),
    mailRouter: require('./api/mailsender'),
    createGroupRouter: require('./api/group/create'),
    createMinutesRouter: require('./api/chatGPT/minutes'),
    createVoiceServer:require('./api/voice/server')
};

router.use("/api/login", api.loginRouter);
router.use("/api/register", api.registerRouter);
router.use("/api/sendmail", api.mailRouter);
router.use("/api/group/create", api.createGroupRouter);
router.use("/api/gpt/minutes", api.createMinutesRouter);
router.use("/api/voice/server", api.createVoiceServer);

module.exports = router;

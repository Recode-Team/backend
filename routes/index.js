const express = require("express");
const router = express();

const api = {
    loginRouter: require("./api/login"),
    registerRouter: require("./api/register"),
    mailRouter: require('./api/mailsender')
};

router.use("/api/login", api.loginRouter);
router.use("/api/register", api.registerRouter);
router.use("/api/sendmail", api.mailRouter);

module.exports = router;

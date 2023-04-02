const express = require("express");
const { swaggerUi, specs } = require('../swagger/swagger');

const router = express();

const api = {
    loginRouter: require("./api/login"),
    registerRouter: require("./api/register.js"),
    mailRouter: require('./api/mailsender')
};

router.use("/api/login", api.loginRouter);
router.use("/api/register", api.registerRouter);
router.use("/api/sendmail", api.mailRouter);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


module.exports = router;

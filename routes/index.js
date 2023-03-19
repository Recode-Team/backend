const express = require("express");

const router = express();

const api = {
    loginRouter: require("./api/login"),
};

router.use("/api", api.loginRouter);

module.exports = router;
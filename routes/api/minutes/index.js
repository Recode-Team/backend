const express = require("express");
const router = express.Router();

const api = {
    minutes: require("./minutesController"),
};

router.use("/", api.minutes);

module.exports = router;
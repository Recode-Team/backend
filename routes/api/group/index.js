const express = require("express");
const router = express.Router();

const api = {
    group: require("./groupController"),
};

router.use("/", api.group);

module.exports = router;
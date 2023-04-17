const express = require("express");
const sequelize = require("../../../models/index");

const router = express.Router();

router.post("/", async(req, res) => {
    let { groupName, groupComment, creator } = req.body;

    
    

});


module.exports = router;

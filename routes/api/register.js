const express = require('express');
const sequelize = require("../../models/index");

const { SHA_KEY } = process.env;
const crypto = require('crypto');

const router = express.Router();


router.post("/", async(req, res, next) => {
    let { email, password, name } = req.body;
    let result = {"results":{}, "status":""};
    const hashed = crypto.createHmac('sha256', SHA_KEY).update(password).digest('hex');

    const user = await sequelize.user.create(
            {email: email, password: hashed, name: name})
        .catch(err => {
            console.error(err)
        })
    if (user == undefined){
        result['status'] = "conflict";
        res.status(409).send(result);
    }
    else{
        result['status'] = "ok";
        res.status(200).send(result);
    }
})


module.exports = router;
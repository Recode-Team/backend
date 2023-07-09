const express = require('express');
const sequelize = require("../../models/index");

const { SHA_KEY } = process.env;
const crypto = require('crypto');

const router = express.Router();

router.post("/", async(req, res, next) => {
    let { email, password, name } = req.body;
    let result = {"results":{}, "status":""};
    const hashed = crypto.createHmac('sha256', SHA_KEY).update(password).digest('hex');

    const user_check = await sequelize.user.findOne({
        where: { email: email }
      }).catch(err => {
        console.error(err);
      });      
    if (user_check == null){
        result['status'] = "conflict";
        result['error'] = "존재하는 email입니다"
        res.status(409).send(result);
    }

    const user = await sequelize.user.create(
            {email: email, password: hashed, name: name})
        .catch(err => {
            console.error(err)
        })

    if (user != undefined) {
        result['status'] = "ok";
        res.status(200).send(result);
    }

    result['status'] = "not found";
    result['error'] = "다시 시도해주세요"
    res.status(404).send(result);
})


module.exports = router;
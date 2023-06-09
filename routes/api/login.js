const express = require("express");
const sequelize = require("../../models/index");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { JWT_KEY, SHA_KEY } = process.env;

const router = express.Router();

//login api
router.post("/", async(req, res) => {
    let { email, password } = req.body;
    let result = {"results":{}, "status":""};
    const hashed = crypto.createHmac('sha256', SHA_KEY).update(password).digest('hex');
    
    let userEmail =  await sequelize.user.findOne({
    // attributes: ['email'],
        where: {
            email: email
        }
    })
    .catch( err => {
        console.log(err)
    })

    let userPass = await sequelize.user.findOne({
        attributes: ['email', 'password', 'name'],
        where: {
            email: email,
            password: hashed
        }
    })
    .catch( err => {
        console.log(err)
    })

    // email not found
    if(userEmail == undefined){
        result['status']  = "not found";
        result['results'] = {"target" : "email"};
        res.status(404).send(result);
    }
    // password not found
    else if(userPass == undefined){
        result['status']  = "not found";
        result['results'] = {"target" : "password"};
        res.status(404).send(result);
    }
    else{
        token = jwt.sign({
            type: 'JWT',
            name: email,
          }, JWT_KEY, {
            expiresIn: '15m', // 만료시간 15분
            issuer: 'yhw',
          });
        result['status']  = "ok"
        result['results'] = {"name": userPass['name'], "token": token}
        res.status(200).send(result);
    }
});

module.exports = router;
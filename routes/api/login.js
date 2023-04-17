const express = require("express");
const sequelize = require("../../models/index");
const crypto = require('crypto');

const { SHA_KEY } = process.env;

const router = express.Router();


//login api
router.get("/", async(req, res) => {
    let { email, password } = req.query;
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
        result['status']  = "ok"
        result['results'] = {"name": userPass['name']}
        res.status(200).send(result);
    }
});

module.exports = router;
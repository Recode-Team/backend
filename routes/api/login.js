const express = require("express");
<<<<<<< Updated upstream
const { Sequelize } = require("sequelize");
const { users, sequelize } = require("../../models/index");
=======
const sequelize = require("../../models/index");
const crypto = require('crypto');
>>>>>>> Stashed changes

const { SHA_KEY } = process.env;

const router = express.Router();

//test login api
<<<<<<< Updated upstream
router.post("/login", async(req, res, next) => {

    
    let { email, password } = req.body;

    let sql = `SELECT email, password FROM user WHERE email='${email}' AND password='${password}`;
    
    
=======
router.get("/test", async(req, res) => {
    let { email, password } = req.query;

>>>>>>> Stashed changes
    try{
        // sequelize.sql(sql)
        let result = false;
        if(email == "test" && password == "password"){
            result = true;
        }

        res.status(200).send({
            data: result,
        });
    } catch(err) {
        res.status(500).send({
            data: false,
        });
    }
});
<<<<<<< Updated upstream
=======

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
        attributes: ['email', 'password'],
        where: {
            email: email,
            password: hashed
        }
    })
    .catch( err => {
        console.log(err)
    })

    console.log(typeof userEmail, userEmail)
    // email not found
    if(userEmail == null){
        result['status']  = "not found";
        result['results'] = {"target" : "email"};
        res.status(404).send(result);
    }
    // password not found
    else if(userPass == null){
        result['status']  = "not found";
        result['results'] = {"target" : "password"};
        res.status(404).send(result);
    }
    else{
        result['status']  = "ok"
        res.status(200).send(result);
    }
});
>>>>>>> Stashed changes

module.exports = router;
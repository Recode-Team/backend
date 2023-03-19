const express = require("express");
const { Sequelize } = require("sequelize");
const { users, sequelize } = require("../../models/index");

const router = express.Router();

//test login api
router.post("/login", async(req, res, next) => {

    
    let { email, password } = req.body;

    let sql = `SELECT email, password FROM user WHERE email='${email}' AND password='${password}`;
    
    
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

module.exports = router;
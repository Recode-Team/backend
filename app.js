const express = require("express");
const helmet = require("helmet");
const helmetCsp = require("helmet-csp");
const nodemailer = require('nodemailer');
const cors = require('cors');
const swaggerFile = require("./swagger-output.json");
const swaggerUi = require("swagger-ui-express")

require("dotenv").config({ path: ".env" });

const app = express();
app.set("port", 27000);

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// router 설정 이전에 CORS 설정 해야함
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile)) 

const router = require("./routes/index");
app.use("/", router);

app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status);
    res.locals.err = err;

    if(res.statusCode != 500) {
        console.log(err);
        err.message = res.__("serverError");
    }
    res.status(500).send("error");
});

//서버 실행
app.listen(app.get("port"), function() {
    console.log(`127.0.0.1:${app.get("port")}`);
});
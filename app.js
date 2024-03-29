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

const router = require("./routes/index");
app.use("/", router);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile)) 

const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) { 
    if (whitelist.indexOf(origin) !== -1) { 
      callback(null, true); // cors 허용
    } else {
      callback(new Error("Not Allowed Origin!")); 
    }
  },
};
app.use(cors(corsOptions));

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
    console.log(`localhost:${app.get("port")}`);
});
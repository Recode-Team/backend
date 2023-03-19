const express = require("express");
const helmet = require("helmet");
const helmetCsp = require("helmet-csp");
const app = express();

app.set("port", 3000);

app.use(helmet());


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const router = require("./routes/index");
app.use("/", router);


app.use("/", (req, res, next) => {
    let err = new Error(res.__("notFoundError"));
    err.status = 404;
    next(err);
});


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
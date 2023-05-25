require("dotenv").config({ path: ".env" });
const { DB_PASSWORD, DB_PORT } = process.env;

module.exports = { 
    database : {
        "development": {
            "username": "root",
            "password": DB_PASSWORD,
            "database": "recode",
            "host": "127.0.0.1",
            "dialect": "mysql",
            "port": DB_PORT,
            "define": {
                "timestamps": false,
                "underscored": true
            }
        }
    }
}

require("dotenv").config({ path: ".env" });
const { DB_PASSWORD } = process.env;

module.exports = { 
    database : {
        "development": {
            "username": "root",
            "password": DB_PASSWORD,
            "database": "recode",
            "host": "127.0.0.1",
            "dialect": "mysql",
            "port": 3306,
            "define": {
                "timestamps": false,
                "underscored": true
            }
        }
    }
}

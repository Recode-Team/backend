require("dotenv").config({ path: ".env" });
const { DB_PASSWORD, DB_PORT, DB_IP } = process.env;

module.exports = { 
    database : {
        "development": {
            "username": "root",
            "password": DB_PASSWORD,
            "database": "recode",
            "host": DB_IP,
            "dialect": "mysql",
            "port": DB_PORT,
            "define": {
                "timestamps": false,
                "underscored": true
            }
        }
    }
}

const SequelizeAuto = require('sequelize-auto');
require("dotenv").config({ path: ".env" });
const { DB_PASSWORD, DB_PORT } = process.env;

console.log(DB_PASSWORD)

const auto = new SequelizeAuto("recode", "root", DB_PASSWORD, {
      host: "127.0.0.1",
      port: DB_PORT,
      dialect: "mysql",
      //noAlias: true // as 별칭 미설정 여부
   }
);
auto.run((err)=>{
   if(err) throw err;
})
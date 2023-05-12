require("dotenv").config({ path: ".env" });
const { JWT_KEY } = process.env;

const jwtConfig = {
    secretKey : JWT_KEY,
    options : {
        algorithm : "HS256",
        expiresIn : "60m",
        issuer : "issuer"
    }
}

module.exports = jwtConfig;
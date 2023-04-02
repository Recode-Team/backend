const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "recode_api",
      description:
        "멀티 디지털 화이트보드 웹",
    },
    servers: [
      {
        url: "http://localhost:27000", // 요청 URL
      },
    ],
  },
  apis: ["./routes/*.js", "./routes/api/*.js"], //Swagger 파일 연동
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }
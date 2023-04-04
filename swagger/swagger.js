const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost",
  schemes: [],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./app.js",
  "./routes/index.js",
  "./routes/api/login.js",
  "./routes/api/register.js",
  "./routes/api/mailsender.js"
];

swaggerAutogen(outputFile, endpointsFiles, doc);
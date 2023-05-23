const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerAutogen = require("swagger-autogen")();

const api = {
  loginRouter: require("../routes/api/login.js"),
  registerRouter: require("../routes/api/register"),
  mailRouter: require('../routes/api/mailsender'),
  createGroupRouter: require('../routes/api/group/create'),
  createMinutesRouter: require('../routes/api/chatGPT/summary/create'),
  MinutesVoiceRouter: require('../routes/api/chatGPT/summary/voice.js'),
  createVoiceServer:require('../routes/api/voice/server')
};

router.use("/api/login", api.loginRouter);
router.use("/api/register", api.registerRouter);
router.use("/api/sendmail", api.mailRouter);
router.use("/api/group/create", api.createGroupRouter);
router.use("/api/gpt/summary/create", api.createMinutesRouter);
router.use("/api/chatGPT/summary/voice", api.MinutesVoiceRouter);
router.use("/api/voice/server", api.createVoiceServer);

const outputFile = "../swagger_output.json";
const endpointsFiles = [
  "../app.js",
  "../routes/index.js",
  "../routes/api/login.js",
  "../routes/api/register.js",
  "../routes/api/mailsender.js",
  "../routes/api/group/create.js",
  "../routes/api/chatGPT/summary/create.js",
  "../routes/api/chatGPT/summary/voice.js",
  "../routes/api/voice/server.js"
];

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "My API",
      description: "Description",
      version: "1.0.0",
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
      },
    },
  },
  apis: endpointsFiles,
};

swaggerAutogen(outputFile, swaggerOptions);

const swaggerDocument = require('../swagger_output.json');
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
module.exports = router;
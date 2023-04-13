var DataTypes = require("sequelize").DataTypes;
var _chatting = require("./chatting");
var _group = require("./group");
var _user = require("./user");

function initModels(sequelize) {
  var chatting = _chatting(sequelize, DataTypes);
  var group = _group(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);


  return {
    chatting,
    group,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

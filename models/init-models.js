var DataTypes = require('sequelize').DataTypes;
var _chatting = require('./chatting');
var _group = require('./group');
var _groupalarm = require('./groupalarm');
var _groupuser = require('./groupuser');
var _minutes = require('./minutes');
var _user = require('./user');
var _board = require('./board');

function initModels(sequelize) {
  var chatting = _chatting(sequelize, DataTypes);
  var group = _group(sequelize, DataTypes);
  var groupalarm = _groupalarm(sequelize, DataTypes);
  var groupuser = _groupuser(sequelize, DataTypes);
  var minutes = _minutes(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var board = _board(sequelize, DataTypes);

  return {
    chatting,
    group,
    groupalarm,
    groupuser,
    minutes,
    user,
    board,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('groupuser', {
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      comment: "user-email"
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "use group nickname"
    }
  }, {
    sequelize,
    tableName: 'groupuser',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "group_id" },
          { name: "email" },
        ]
      },
    ]
  });
};

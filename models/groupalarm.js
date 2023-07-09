const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('groupalarm', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    alarm: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "0"
    }
  }, {
    sequelize,
    tableName: 'groupalarm',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};

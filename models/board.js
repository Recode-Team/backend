const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'board',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      boardname: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '',
      },
      boardcomment: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      creater: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'board',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};

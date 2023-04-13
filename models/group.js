const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('group', {
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "user-email"
    },
    group_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "use group nickname"
    },
    doc: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    setting: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "해당 10진수를 2진수로 변환해서 설정 0과 1로 할당"
    }
  }, {
    sequelize,
    tableName: 'group',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "group_id" },
        ]
      },
    ]
  });
};

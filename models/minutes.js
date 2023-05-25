const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('minutes', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    transcription: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "요약하기 전의 대화",
      charset: 'utf8mb4', // 문자셋 지정
      collate: 'utf8mb4_unicode_ci', // 정렬 지정
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
      charset: 'utf8mb4', // 문자셋 지정
      collate: 'utf8mb4_unicode_ci', // 정렬 지정
    }
  }, {
    sequelize,
    tableName: 'minutes',
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

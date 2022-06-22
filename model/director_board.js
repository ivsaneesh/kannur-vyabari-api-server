const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('director_board', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    member_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    designation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    deleted_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    tableName: 'director_board',
    timestamps: false,
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

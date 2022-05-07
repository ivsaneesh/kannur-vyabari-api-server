const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('area', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_number: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    manager_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    modified_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'area',
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

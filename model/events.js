const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('events', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    manager_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    manager_aadhar: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    manager_mobile: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    event_date: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null
    }
  }, {
    sequelize,
    tableName: 'events',
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

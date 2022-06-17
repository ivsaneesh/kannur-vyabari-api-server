const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('commition', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dead_member_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    collector_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    collector_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    percentage: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    amount_given: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    created_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'commition',
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

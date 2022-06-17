const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ledger', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    credit_debit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    collector_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    given_to_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    given_to_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    modified_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    deleted: {
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
    tableName: 'ledger',
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

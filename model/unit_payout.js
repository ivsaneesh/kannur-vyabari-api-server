const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('unit_payout', {
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
    member_id: {
      type: DataTypes.INTEGER,
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
    details: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    cheque_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'unit_payout',
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

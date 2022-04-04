const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('external_entity_payout', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    external_entity_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bill_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    amount_given: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    payout_date: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    offer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bill_details: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'external_entity_payout',
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

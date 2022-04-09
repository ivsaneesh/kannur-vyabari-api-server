const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('offer_given', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    offer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    external_entity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    expiry_date: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'offer_given',
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

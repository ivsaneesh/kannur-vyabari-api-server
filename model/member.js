const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('member', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    middle_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    aadhar: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    register_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "member_id"
    },
    migrated: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    plus_member: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    unit_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    designation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    form_photo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_on: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modified_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    dead: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    in_active_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'member',
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
      {
        name: "id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "member_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "register_number" },
        ]
      },
    ]
  });
};

const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('send_area_sms', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        area_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        completed: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        created_on: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        modified_on: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'send_area_sms',
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

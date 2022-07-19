const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('sms_log', {
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
        response: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        send: {
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
    }, {
        sequelize,
        tableName: 'sms_log',
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

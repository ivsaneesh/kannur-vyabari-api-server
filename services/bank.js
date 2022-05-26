"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
class Bank {
    constructor() { }
    async createBank(req, res) {
        var sequelize = req.app.get("sequelize");
        var logger = req.app.get("logger");
        try {
            if (!utils.isNotUndefined(req.body.name)) {
                return res.json({ status: "error", message: "Bank name is required!" });
            }
            if (!utils.isNotUndefined(req.body.account_number)) {
                return res.json({
                    status: "error",
                    message: "Account number is required!",
                });
            }

            // check if Bank detail exist
            var bankIdResult = await api.findOneAsync(sequelize, "Bank", {
                where: { name: req.body.name, account_number: req.body.account_number },
            });

            if (bankIdResult && bankIdResult.account_number) {
                return res.json({
                    status: "error",
                    message: "Bank deatils already exist!",
                });
            }

            var bank_data = {
                name: req.body.name,
                account_number: req.body.account_number,
                ifsc_code: req.body.ifsc_code ? req.body.ifsc_code : null,
                branch: req.body.branch ? req.body.branch : null,
                details: req.body.details ? req.body.details : null,
                created_on: req.body.created_on
                    ? req.body.created_on
                    : moment(new Date()).format("X"),
            };

            var bankResult = await api.createAsync(sequelize, "Bank", bank_data);
            return res.json({ status: "success", data: bankResult });
        } catch (err) {
            logger.error("Bank Create Exception :---->");
            logger.error(err);
            return res.json({ status: "error", message: sequelize.getErrors(err) });
        }
    }

    async listBank(req, res) {
        var sequelize = req.app.get("sequelize");
        var logger = req.app.get("logger");
        const Op = sequelize.Sequelize.Op;
        var offset = req.body.start ? req.body.start : 0;
        var limit = req.body.limit ? req.body.limit : 10;
        var pagination = req.body.pagination
            ? req.body.pagination == 1
                ? 1
                : 0
            : 0;
        var bank_condition = {};
        try {
            if (utils.isNotUndefined(req.body.id)) {
                bank_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.search)) {
                bank_condition = {
                    [Op.or]: [
                        { name: { [Op.like]: "%" + req.body.search + "%" } },
                        { branch: { [Op.like]: "%" + req.body.search + "%" } },
                        { account_number: { [Op.like]: "%" + req.body.search + "%" } },
                    ],
                };
            }
            bank_condition.deleted = 0;

            var json_obj = { where: bank_condition };
            json_obj.offset = offset;
            json_obj.limit = limit;
            json_obj.pagination = pagination;
            var exclude = ['created_on', 'modified_on', 'deleted']
            json_obj.attributes = { exclude: exclude };
            if (req.body.sort_column) {
                json_obj.order = [
                    [
                        req.body.sort_column,
                        req.body.sort_order ? req.body.sort_order : "ASC",
                    ],
                ];
            }
            var result = await api.findAllAsync(sequelize, "Bank", json_obj);
            return res.json({ status: "success", data: result });
        } catch (err) {
            logger.error("Bank List Exception :---->");
            logger.error(err);
            return res.json({ status: "error", message: sequelize.getErrors(err) });
        }
    }

    async updateBank(req, res) {
        var sequelize = req.app.get("sequelize");
        const Op = sequelize.Sequelize.Op;
        var logger = req.app.get("logger");
        try {
            if (!utils.isNotUndefined(req.body.bank_id)) {
                return res.json({ status: "error", message: "Bank id is required!" });
            }
            // check if Bank detail exist
            var bankIdResult = await api.findOneAsync(sequelize, "Bank", {
                where: {
                    name: req.body.name,
                    account_number: req.body.account_number,
                    id: { [Op.not]: req.body.bank_id },
                },
            });
            if (bankIdResult && bankIdResult.id_number) {
                return res.json({
                    status: "error",
                    message: "Bank details already exist!",
                });
            }
            const bank_data = {};
            if (utils.isNotUndefined(req.body.name)) bank_data.name = req.body.name;
            if (utils.isNotUndefined(req.body.account_number))
                bank_data.account_number = req.body.account_number;
            if (utils.isNotUndefined(req.body.ifsc_code))
                bank_data.ifsc_code = req.body.ifsc_code;
            if (utils.isNotUndefined(req.body.branch))
                bank_data.branch = req.body.branch;
            if (utils.isNotUndefined(req.body.details))
                bank_data.details = req.body.details;

            bank_data.modified_on = moment(new Date()).format("X");

            var condition = { where: { id: req.body.bank_id } };

            // updating bank
            api.updateCustom(
                sequelize,
                "Bank",
                bank_data,
                condition,
                function (status, data, message) {
                    if (status == "error") {
                        return res.json({ status: status, message: message });
                    } else {
                        return res.json({ status: status, data: data, message: message });
                    }
                }
            );
        } catch (err) {
            logger.error("Bank Update Exception :---->");
            logger.error(err);
            return res.json({ status: "error", message: sequelize.getErrors(err) });
        }
    }
    async deleteBank(req, res) {
        var sequelize = req.app.get("sequelize");
        var logger = req.app.get("logger");
        try {
            if (!utils.isNotUndefined(req.body.bank_id)) {
                return res.json({ status: "error", message: "Bank id is required!" });
            }
            const bank_data = {};
            bank_data.deleted = 1;
            bank_data.modified_on = moment(new Date()).format("X");

            var condition = { where: { id: req.body.bank_id } };

            // updating bank to deleted 1
            api.updateCustom(
                sequelize,
                "Bank",
                bank_data,
                condition,
                function (status, data, message) {
                    if (status == "error") {
                        return res.json({ status: status, message: message });
                    } else {
                        return res.json({ status: status, data: data, message: message });
                    }
                }
            );
        } catch (err) {
            logger.error("Bank delete Exception :---->");
            logger.error(err);
            return res.json({ status: "error", message: sequelize.getErrors(err) });
        }
    }

    // bank transaction
    async createBankTrans(req, res) {
        var sequelize = req.app.get("sequelize");
        var logger = req.app.get("logger");
        try {
            if (!utils.isNotUndefined(req.body.bank_id)) {
                return res.json({ status: "error", message: "Bank id is required!" });
            }
            if (!utils.isNotUndefined(req.body.amount)) {
                return res.json({ status: "error", message: "Amount is required!" });
            }
            if (!utils.isNotUndefined(req.body.action)) {
                return res.json({ status: "error", message: "Action is required!" });
            }

            var bank_data = {
                action: req.body.action,
                amount: req.body.amount,
                bank_id: req.body.bank_id,
                remark:req.body.remark ? req.body.remark : null,
                created_on: req.body.created_on
                    ? req.body.created_on
                    : moment(new Date()).format("X"),
            };

            var bankResult = await api.createAsync(sequelize, "BankTransaction", bank_data);
            return res.json({ status: "success", data: bankResult });
        } catch (err) {
            logger.error("Bank Transaction Create Exception :---->");
            logger.error(err);
            return res.json({ status: "error", message: sequelize.getErrors(err) });
        }
    }

    async listBankTrans(req, res) {
        var sequelize = req.app.get("sequelize");
        var logger = req.app.get("logger");
        const Op = sequelize.Sequelize.Op;
        var offset = req.body.start ? req.body.start : 0;
        var limit = req.body.limit ? req.body.limit : 10;
        var pagination = req.body.pagination
            ? req.body.pagination == 1
                ? 1
                : 0
            : 0;
        var bank_condition = {};
        try {
            if (utils.isNotUndefined(req.body.id)) {
                bank_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.amount)) {
                bank_condition.amount = req.body.amount;
            }
            if (utils.isNotUndefined(req.body.action)) {
                bank_condition.action = req.body.action;
            }
            if (utils.isNotUndefined(req.body.bank_id)) {
                bank_condition.bank_id = req.body.bank_id;
            }
            bank_condition.deleted = 0;

            var json_obj = { where: bank_condition };
            json_obj.offset = offset;
            json_obj.limit = limit;
            json_obj.pagination = pagination;
            var exclude = ['modified_on', 'deleted']
            json_obj.attributes = { exclude: exclude };
            if (req.body.sort_column) {
                json_obj.order = [
                    [
                        req.body.sort_column,
                        req.body.sort_order ? req.body.sort_order : "ASC",
                    ],
                ];
            }
            var result = await api.findAllAsync(sequelize, "BankTransaction", json_obj);
            return res.json({ status: "success", data: result });
        } catch (err) {
            logger.error("Bank Transcation List Exception :---->");
            logger.error(err);
            return res.json({ status: "error", message: sequelize.getErrors(err) });
        }
    }
}

module.exports = new Bank();

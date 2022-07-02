"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
class Wallet {
    constructor() { }

    async creditWallet(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.member_id)) {
                return res.json({ "status": "error", "message": "member_id is required!" });
            }
            if (!utils.isNotUndefined(req.body.amount)) {
                return res.json({ "status": "error", "message": "amount is required!" });
            }
            if (!utils.isNotUndefined(req.body.type)) {
                return res.json({ "status": "error", "message": "type id is required!" });
            }
            if (!utils.isNotUndefined(req.body.details)) {
                return res.json({ "status": "error", "message": "details is required!" });
            }

            var wallet_data = {
                'member_id': req.body.member_id,
                'amount': req.body.amount,
                'type': req.body.type,
                'details': req.body.details,
                'created_by': req.user.user_id,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            var walletResult = await api.createAsync(sequelize, "WalletCredit", wallet_data);
            return res.json({ "status": 'success', "data": walletResult });
        }
        catch (err) {
            logger.error("creditWallet Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    async debitWallet(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.member_id)) {
                return res.json({ "status": "error", "message": "member_id is required!" });
            }
            if (!utils.isNotUndefined(req.body.amount)) {
                return res.json({ "status": "error", "message": "amount is required!" });
            }
            if (!utils.isNotUndefined(req.body.dead_member_id)) {
                return res.json({ "status": "error", "message": "dead_member_id is required!" });
            }
            if (!utils.isNotUndefined(req.body.details)) {
                return res.json({ "status": "error", "message": "details is required!" });
            }

            var wallet_data = {
                'member_id': req.body.member_id,
                'amount': req.body.amount,
                'dead_member_id': req.body.dead_member_id,
                'details': req.body.details,
                'created_by': req.user.user_id,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            var walletResult = await api.createAsync(sequelize, "WalletDebit", wallet_data);
            return res.json({ "status": 'success', "data": walletResult });
        }
        catch (err) {
            logger.error("debitWallet Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    async listCreditWallet(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var wallet_condition = {}
        try {
            if (utils.isNotUndefined(req.body.id)) {
                wallet_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.type)) {
                wallet_condition = { [Op.or]: [{ type: { [Op.like]: '%' + req.body.type + '%' } }] };
            }
            if (utils.isNotUndefined(req.body.member_id)) {
                wallet_condition.member_id = req.body.member_id;
            }
            if (utils.isNotUndefined(req.body.amount)) {
                wallet_condition.amount = req.body.amount;
            }
            wallet_condition.deleted = 0;

            var json_obj = { where: wallet_condition }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "WalletCredit", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("listCreditWallet Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }


    async listDebitWallet(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var wallet_condition = {}
        try {
            if (utils.isNotUndefined(req.body.id)) {
                wallet_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.dead_member_id)) {
                wallet_condition.dead_member_id = req.body.dead_member_id;
            }
            if (utils.isNotUndefined(req.body.member_id)) {
                wallet_condition.member_id = req.body.member_id;
            }
            if (utils.isNotUndefined(req.body.amount)) {
                wallet_condition.amount = req.body.amount;
            }
            wallet_condition.deleted = 0;

            var json_obj = { where: wallet_condition }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "WalletDebit", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("listDebitWallet Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    async listWallet(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var wallet_condition = {}
        try {

            if (utils.isNotUndefined(req.body.member_id)) {
                wallet_condition.member_id = req.body.member_id;
            }

            if (utils.isNotUndefined(req.body.created_on)) {
                wallet_condition.created_on = moment(req.body.created_on).format("X");
            }
            wallet_condition.deleted = 0;
            var include = [sequelize.Sequelize.union([
                { model: sequelize.models.WalletCredit, as: "WalletCredit", attributes: ['id', 'member_id', 'amount', 'type', 'details', 'created_on'] },
                { model: sequelize.models.WalletDebit, as: "WalletDebit", attributes: ['id', 'member_id', 'amount', 'dead_member_id', 'details', 'created_on'] }
            ])];

            var json_obj = { where: wallet_condition, include: include }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "Member", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("listDebitWallet Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

}

module.exports = new Wallet()

"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
var async = require('async');
class Wallet {
    constructor() { }

    async addToWallet(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.member_id)) {
                return res.json({ "status": "error", "message": "member_id is required!" });
            }
            if (!utils.isNotUndefined(req.body.amount)) {
                return res.json({ "status": "error", "message": "amount is required!" });
            }
            if (!utils.isNotUndefined(req.body.credit_debit)) {
                return res.json({ "status": "error", "message": "credit_debit is required!" });
            }
            if (!utils.isNotUndefined(req.body.type)) {
                return res.json({ "status": "error", "message": "type is required!" });
            }
            if (!utils.isNotUndefined(req.body.details)) {
                return res.json({ "status": "error", "message": "details is required!" });
            }

            var wallet_data = {
                'member_id': req.body.member_id,
                'amount': req.body.amount,
                'credit_debit': req.body.credit_debit,
                'type': req.body.type,
                'details': req.body.details,
                'created_by': req.user.user_id,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            var walletResult = await api.createAsync(sequelize, "Wallet", wallet_data);
            return res.json({ "status": 'success', "data": walletResult });
        }
        catch (err) {
            logger.error("Wallet Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }


    async listWalletTranscation(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const mysql = req.app.get('mysql')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var wallet_condition = {}
        var memberId;
        try {
            if (!utils.isNotUndefined(req.body.member_id)) {
                return res.json({ "status": "error", "message": "member_id is required!" });
            }
            if (utils.isNotUndefined(req.body.credit_debit)) {
                wallet_condition.credit_debit = req.body.credit_debit;
            }
            if (utils.isNotUndefined(req.body.type)) {
                wallet_condition = { [Op.or]: [{ type: { [Op.like]: '%' + req.body.type + '%' } }] };
            }
            if (utils.isNotUndefined(req.body.member_id)) {
                wallet_condition.member_id = req.body.member_id;
                memberId = req.body.member_id;
            }
            if (utils.isNotUndefined(req.body.amount)) {
                wallet_condition.amount = req.body.amount;
            }

            var json_obj = { where: wallet_condition, attributes: ['id', 'member_id', 'amount', 'type', 'credit_debit', 'details', 'created_on'] }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "DESC"]]
            }
            var wallet_result = await api.findAllAsync(sequelize, "Wallet", json_obj);

            var credit_query = "SELECT sum(amount) as total FROM wallet WHERE credit_debit = 0 and member_id = " + memberId + ";";
            var debit_query = "SELECT sum(amount) as total FROM wallet WHERE credit_debit = 1 and member_id = " + memberId + ";";

            async.parallel([
                function (callback) {
                    mysql.query(credit_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }
                    })
                },
                function (callback) {
                    mysql.query(debit_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }
                    })
                },
            ], function (err, results) {
                if (err) {
                    logger.error("wallet sum Report Exception :---->")
                    logger.error(err)
                    return res.json({ "status": 'error', "message": 'Something broken!' });
                }
                var balance = 0;
                if (utils.isNotUndefined(results[0][0]['total'])) {
                    balance = results[0][0]['total'];
                    if (utils.isNotUndefined(results[1][0]['total'])) {
                        balance = results[0][0]['total'] - results[1][0]['total'];
                    }
                }
                else {
                    if (utils.isNotUndefined(results[1][0]['total'])) {
                        balance = results[1][0]['total'];
                    }
                }

                var result = {
                    "transcation": wallet_result,
                    "credit_total":utils.isNotUndefined(results[0][0]['total']) ? results[0][0]['total'] : 0,
                    "debit_total": utils.isNotUndefined(results[1][0])['total'] ? results[1][0]['total'] : 0,
                    "balance": balance
                };
                // console.log("result >>> ", results);
                return res.json({ "status": 'success', "data": result });
            });
        }
        catch (err) {
            logger.error("listCreditWallet Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }


    async listMemberWallet(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var wallet_condition = {}
        try {
            if (utils.isNotUndefined(req.body.member_id)) {
                wallet_condition.id = req.body.member_id;
            }
            if (utils.isNotUndefined(req.body.created_on)) {
                wallet_condition.created_on = moment(req.body.created_on).format("X");
            }
            if (utils.isNotUndefined(req.body.dead)) {
                wallet_condition.dead = req.body.dead;
            }
            var include = [
                {
                    model: sequelize.models.Wallet, as: "Wallet",
                    attributes: ['id', 'member_id', 'amount', 'credit_debit', 'type', 'details', 'created_on']
                },
            ];

            var json_obj = { where: wallet_condition, include: include, attributes: ['id', 'first_name', 'middle_name', 'last_name', 'register_number', 'photo'] }
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
            logger.error("listMemberWallet Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }


    // async walletCount(req, res) {
    //     var sequelize = req.app.get('sequelize')
    //     var logger = req.app.get('logger')
    //     const mysql = req.app.get('mysql')
    //     try {
    //         var transc_query = `SELECT sum(amount) as total, *  FROM Wallet;`;
    //         // var debit_sum_query = `SELECT sum(amount) as total  FROM Wallet_debit;`;
    //         // var transc_query = `SELECT * FROM (SELECT * FROM Wallet_credit  UNION   SELECT * FROM Wallet_debit ) wallet ORDER BY created_on DESC;`;


    //         if (utils.isNotUndefined(req.body.member_id)) {
    //             var memberId = req.body.member_id;

    //             transc_query = `SELECT sum(amount) as total, * FROM Wallet WHERE member_id= ` + memberId + `;`;
    //             // debit_sum_query = `SELECT sum(amount) as total  FROM Wallet_debit WHERE member_id= ` + memberId + `;`;
    //             // transc_query = `SELECT * FROM (SELECT * FROM Wallet_credit  WHERE member_id= ` + memberId + ` UNION   SELECT * FROM Wallet_debit  WHERE member_id= ` + memberId + `) wallet ORDER BY created_on DESC;`;
    //         }



    //         async.parallel([
    //             function (callback) {
    //                 mysql.query(transc_query, (error, data) => {
    //                     if (error) {
    //                         callback(error, null)
    //                     } else {
    //                         callback(null, data)
    //                     }
    //                 })
    //             },
    //             // function (callback) {
    //             //     mysql.query(credit_sum_query, (error, data) => {
    //             //         if (error) {
    //             //             callback(error, null)
    //             //         } else {
    //             //             callback(null, data)
    //             //         }
    //             //     })
    //             // },
    //             // function (callback) {
    //             //     mysql.query(debit_sum_query, (error, data) => {
    //             //         if (error) {
    //             //             callback(error, null)
    //             //         } else {
    //             //             callback(null, data)
    //             //         }
    //             //     })
    //             // }
    //         ], function (err, results) {
    //             if (err) {
    //                 logger.error("walletCount Report Exception :---->")
    //                 logger.error(err)
    //                 return res.json({ "status": 'error', "message": 'Something broken!' });
    //             }
    //             // final callback
    //             var walletResult = {}
    //             walletResult['transcations'] = results[0];
    //             // walletResult['credit_total'] = results[1][0]['total'] != null ? results[1][0] : { "total": 0 };
    //             // walletResult['debit_total'] = results[2][0]['total'] != null ? results[2][0] : { "total": 0 };

    //             // console.log("result >>> ", results);
    //             return res.json({ "status": 'success', "data": walletResult });
    //         });

    //     }
    //     catch (err) {
    //         logger.error("walletCount Exception :---->")
    //         logger.error(err)
    //         return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
    //     }
    // }

}

module.exports = new Wallet()

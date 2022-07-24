"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
var async = require('async');
const wallet = require('./wallet');

class Collection {

    constructor() {

    }
    async createCollection(req, res) {
        var transaction;
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!req.body.member_id) {
                return res.json({ "status": "error", "message": "member id is required!" });
            }
            if (!req.body.dead_member_id) {
                return res.json({ "status": "error", "message": "dead member id is required!" });
            }
            if (!req.body.amount_id) {
                return res.json({ "status": "error", "message": "amount id is required!" });
            }
            transaction = await sequelize.sequelize.transaction();
            var collection_data = {
                'member_id': req.body.member_id ? req.body.member_id : null,
                'dead_member_id': req.body.dead_member_id ? req.body.dead_member_id : null,
                'collector_id': req.body.collector_id ? req.body.collector_id : null,
                'collector_type': req.body.collector_type ? req.body.collector_type : null,
                'amount_id': req.body.amount_id ? req.body.amount_id : null,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X"),
                'created_by': req.user.user_id,

            }
            // inserting user permission
            var result = await api.createAsync(sequelize, "Collection", collection_data, transaction);

            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("collection Create Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async createBulkCollection(collectionArray, transaction, sequelize, logger) {
        try {
            if (!collectionArray) {
                return { "status": "error", "message": "Collection Array is required!" };
            }
            // inserting collection
            var result = await api.bulkCreateT(sequelize, "Collection", collectionArray, transaction);
            return { "status": 'success', "data": result };
        }
        catch (err) {
            logger.error("collection Create Exception :---->")
            logger.error(err)
            return { "status": 'error', "message": sequelize.getErrors(err) }
        }
    }
    async listCollection(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var collection_condition = {}
        var member_condition = {}
        try {
            if (utils.isNotUndefined(req.body.id)) {
                collection_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.member_id)) {
                collection_condition.member_id = req.body.member_id;
            }
            if (utils.isNotUndefined(req.body.dead_member_id)) {
                collection_condition.dead_member_id = req.body.dead_member_id;
            }
            if (utils.isNotUndefined(req.body.paid)) {
                collection_condition.paid = req.body.paid;
            }
            var json_obj = { where: collection_condition }

            /// if uinit_id is present add unit condition to member
            if (utils.isNotUndefined(req.body.unit_id)) {
                member_condition.unit_id = req.body.unit_id;
                var include = [{
                    model: sequelize.models.Member, as: "Member",
                    where: member_condition,
                    attributes: ['id', 'first_name', 'middle_name', 'last_name', 'register_number', 'mobile', 'photo']
                },];
                json_obj.include = include;
            }
            else {
                var include = [{
                    model: sequelize.models.Member, as: "Member",
                    attributes: ['id', 'first_name', 'middle_name', 'last_name', 'register_number', 'mobile', 'photo']
                },];
                json_obj.include = include;
            }

            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var collection_result = await api.findAllAsync(sequelize, "Collection", json_obj);

            var resultValue = collection_result;
            if (req.body.pagination == 1) {
                resultValue = collection_result.rows;
            }

            /// for each collection get the member wallet balance
            for (let index = 0; index < resultValue.length; ++index) {
                var Wallet = await this.memberWalletBalance(req, resultValue[index].member_id);

                var balance = 0;
                if (utils.isNotUndefined(Wallet.credit.total)) {
                    balance = Wallet.credit.total;
                    if (utils.isNotUndefined(Wallet.debit.total)) {
                        balance = Wallet.credit.total - Wallet.debit.total;
                    }
                }
                else {
                    if (utils.isNotUndefined(Wallet.debit.total)) {
                        balance = Wallet.debit.total * -1;
                    }
                }
                var wallet_result = {
                    "credit_total": Wallet.credit.total ? Wallet.credit.total : 0,
                    "debit_total": Wallet.debit.total ? Wallet.debit.total : 0,
                    "balance": balance
                };
                resultValue[index].setDataValue('Wallet', wallet_result);
            }

            if (req.body.pagination == 1) {
                collection_result.rows = resultValue;
                return res.json({ "status": 'success', "data": await collection_result });
            }
            else {

                return res.json({ "status": 'success', "data": await resultValue });
            }

        }
        catch (err) {

            console.error("Collection List Exception :---->")
            console.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async collectionAmount(req, res) {
        var transaction;
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            var json_obj = { where: { 'deleted': 0 } };
            var exclude = ['deleted_on', 'deleted']
            json_obj.attributes = { exclude: exclude };

            var result = await api.findAllAsync(sequelize, "CollectionAmount", json_obj);

            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("collection Amount fetch Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async createCollectionAmount(req, res) {
        var transaction;
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!req.body.amount) {
                return res.json({ "status": "error", "message": "amount is required!" });
            }
            if (!req.body.type) {
                return res.json({ "status": "error", "message": "type is required!" });
            }
            var collection_data = {
                'amount': req.body.amount,
                'type': req.body.type,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X"),
                'created_by': req.user.user_id
            }
            transaction = await sequelize.sequelize.transaction();

            var update_data = {
                'deleted': 1,
                'deleted_on': moment(new Date()).format("X"),
                'deleted_by': req.user.user_id,
            }
            var update_condition = {
                where: { 'type': req.body.type }
            }
            // updating amount in the table
            var update_result = await api.updateCustomT(sequelize, "CollectionAmount", update_data, update_condition, transaction);

            // inserting new amount
            var result = await api.createT(sequelize, "CollectionAmount", collection_data, transaction);
            await transaction.commit();

            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("collection Amount Create Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async updateCollection(req, res) {
        const sequelize = req.app.get('sequelize')
        const logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        try {
            if (!utils.isNotUndefined(req.body.member_id)) {
                return res.json({ "status": "error", "message": "member_id is required!" });
            }
            if (!utils.isNotUndefined(req.body.unit_id)) {
                return res.json({ "status": "error", "message": "unit_id is required!" });
            }
            if (!utils.isNotUndefined(req.body.area_id)) {
                return res.json({ "status": "error", "message": "area_id is required!" });
            }
            if (!utils.isNotUndefined(req.body.dead_member_id)) {
                return res.json({ "status": "error", "message": "dead_member_id is required!" });
            }
            if (!utils.isNotUndefined(req.body.collector_id)) {
                return res.json({ "status": "error", "message": "collector id is required!" });
            }
            if (!Array.isArray(req.body.member_id)) {
                return res.json({ "status": "error", "message": "member_id must be array!" });
            }
            if (req.body.member_id.length < 1) {
                return res.json({ "status": "error", "message": "member_id array can not be null" });
            }
            var collectorIdResult = await api.findOneAsync(sequelize, "Collector", { where: { 'id': req.body.collector_id } });
            if (!collectorIdResult) {
                return res.json({ "status": "error", "message": "There is no collector with this collector id" });
            }
            const collection_data = {}
            collection_data.paid = 1;
            collection_data.collector_id = req.body.collector_id;
            collection_data.modified_on = moment(new Date()).format("X");
            collection_data.modified_by = req.user.user_id;

            /// fetching distinct collection amountId from collection table
            var collection_condition = { where: { 'dead_member_id': req.body.dead_member_id, 'member_id': { [Op.in]: req.body.member_id, } }, attributes: [[sequelize.Sequelize.fn('DISTINCT', sequelize.Sequelize.col('amount_id')), 'amount_id']] };
            var collectionData = await api.findAllAsync(sequelize, "Collection", collection_condition);

            /// fetch amount corresponding to collection amountId
            var collection_amount_condition = {};
            if (collectionData.length > 1) {
                collection_amount_condition = { where: { [Op.or]: [{ 'id': collectionData[0].amount_id }, { 'id': collectionData[1].amount_id }], } };
            }
            else {
                collection_amount_condition = { where: { 'id': collectionData[0].amount_id } };
            }
            var amountData = await api.findAllAsync(sequelize, "CollectionAmount", collection_amount_condition);

            // updating collection
            var condition = { where: { 'dead_member_id': req.body.dead_member_id, 'member_id': { [Op.in]: req.body.member_id } } };
            api.updateCustom(sequelize, 'Collection', collection_data, condition, async function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    /// fetch member list for getting plus_member detail
                    let memberData = await api.findAllAsync(sequelize, "Member", { where: { 'id': { [Op.in]: req.body.member_id } }, attributes: ['id', 'plus_member'] });
                    memberData.forEach(async (item) => {

                        /// amount paid by member. checking if member is plus_member and set the approprate amount
                        var amount = amountData[0].amount;
                        console.log("amountData >>> ", amountData);
                        console.log("amountData[0].amount >>> ", amountData[0].amount);

                        if (item.plus_member === 0) {
                            if (amountData[0].type == 'default') {
                                amount = amountData[0].amount;
                            } else {
                                amount = amountData[1].amount;
                            }
                        } else {
                            if (amountData[0].type != 'default') {
                                amount = amountData[0].amount;
                            } else {
                                amount = amountData[1].amount;
                            }
                        }

                        /// update the wallet. subtract wallet balance with collection amount
                        if (utils.isNotUndefined(req.body.wallet) && Array.isArray(req.body.wallet)) {
                            if (req.body.wallet.includes(item.id)) {
                                var condition = { where: { 'member_id': item.id } };
                                const wallet_data = {}
                                wallet_data.modified_on = moment(new Date()).format("X");
                                wallet_data.modified_by = req.user.user_id;
                                wallet_data.amount = sequelize.Sequelize.literal(`amount - ${amount}`);
                                api.updateCustom(sequelize, 'Wallet', wallet_data, condition, function (status, data, message) { });
                            }
                        }

                        /// setting the commision to CollectionPartition
                        let partitionArray = [];
                        let partitionUnitData = {
                            type: "Unit",
                            type_id: req.body.unit_id,
                            dead_member_id: req.body.dead_member_id,
                            amount: Math.round((2 / 100) * amount),
                            created_on: moment(new Date()).format("X"),
                            created_by: req.user.user_id
                        }
                        partitionArray.push(partitionUnitData);
                        let partitionAreaData = {
                            type: "Area",
                            type_id: req.body.area_id,
                            dead_member_id: req.body.dead_member_id,
                            amount: Math.round((2 / 100) * amount),
                            created_on: moment(new Date()).format("X"),
                            created_by: req.user.user_id
                        }
                        partitionArray.push(partitionAreaData);
                        let partitionDistrictData = {
                            type: "District",
                            type_id: 0,
                            dead_member_id: req.body.dead_member_id,
                            amount: Math.round((2 / 100) * amount),
                            created_on: moment(new Date()).format("X"),
                            created_by: req.user.user_id
                        }
                        partitionArray.push(partitionDistrictData);
                        let partitionCollectorData = {
                            type: "Collector",
                            type_id: req.body.collector_id,
                            dead_member_id: req.body.dead_member_id,
                            amount: Math.round((4 / 100) * amount),
                            created_on: moment(new Date()).format("X"),
                            created_by: req.user.user_id
                        }
                        partitionArray.push(partitionCollectorData);
                        await api.bulkCreateAsync(sequelize, 'CollectionPartition', partitionArray)

                        return res.json({ "status": status, "data": data })
                    });
                }
            });
        }
        catch (err) {
            logger.error("Collection Update Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async removeCollectionAmount(req, res) {
        var transaction;
        const sequelize = req.app.get('sequelize')
        const logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        try {
            if (!utils.isNotUndefined(req.body.collectionAmountId)) {
                return res.json({ "status": "error", "message": "collectionAmountId is required!" });
            }
            transaction = await sequelize.sequelize.transaction();

            var update_data = {
                'deleted': 1,
                'deleted_on': moment(new Date()).format("X"),
                'deleted_by': req.user.user_id,
            }
            var update_condition = {
                where: { 'id': req.body.collectionAmountId }
            }
            // updating amount in the table
            var result = await api.updateCustomT(sequelize, "CollectionAmount", update_data, update_condition, transaction);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Collection amount Update Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    /// return the wallet balance of member
    async memberWalletBalance(req, memberId,) {
        try {
            var sequelize = req.app.get('sequelize')

            var json_obj0 = { where: { 'credit_debit': 0, 'member_id': memberId }, raw: true, }
            var json_obj1 = { where: { 'credit_debit': 1, 'member_id': memberId }, raw: true, }

            json_obj0.attributes = [[sequelize.Sequelize.fn('sum', sequelize.Sequelize.col('amount')), 'total']];
            json_obj1.attributes = [[sequelize.Sequelize.fn('sum', sequelize.Sequelize.col('amount')), 'total']];

            var result0 = await api.findAllAsync(sequelize, "Wallet", json_obj0,);
            var result1 = await api.findAllAsync(sequelize, "Wallet", json_obj1,);
            return { 'credit': result0[0], 'debit': result1[0] };
        }
        catch (err) {
            console.error("memberWalletBalance Exception :---->")
            console.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

}


module.exports = new Collection()


"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
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
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "Collection", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Collection List Exception :---->")
            logger.error(err)
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
            // fetch the amount that is not deleted
            var result = await api.findOneAsync(sequelize, "CollectionAmount", json_obj);

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
            var collection_data = {
                'amount': req.body.amount ? req.body.amount : null,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X"),
                'created_by': req.user.user_id,

            }
            transaction = await sequelize.sequelize.transaction();

            var update_data = {
                'deleted': 1,
                'deleted_on': moment(new Date()).format("X"),
                'deleted_by': req.user.user_id,
            }
            var update_condition = {
                where: { 'deleted': 0 }
            }
            // updating all amount in the table to deleted before adding new amount

            var colledtion_amount_update = api.updateCustomT(sequelize, "CollectionAmount", update_data, update_condition, transaction);

            // inserting new amount
            var result = await api.createAsync(sequelize, "CollectionAmount", collection_data, transaction);
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
            if (utils.isNotUndefined(req.body.paid)) collection_data.paid = req.body.paid;
            collection_data.collector_id = req.body.collector_id;
            collection_data.modified_on = moment(new Date()).format("X");
            collection_data.modified_by = req.user.user_id;

            var condition = { where: { 'dead_member_id': req.body.dead_member_id, 'member_id': { [Op.in]: req.body.member_id } } };
            var collectionData = await api.findOneAsync(sequelize, "Collection", condition);
            var amountData = await api.findOneAsync(sequelize, "CollectionAmount", { where: { 'id': collectionData.amount_id } });
            // updating collection
            api.updateCustom(sequelize, 'Collection', collection_data, condition, async function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    if (utils.isNotUndefined(req.body.paid) && req.body.paid == 1){
                        req.body.member_id.forEach(async (item) => {
                            let partitionArray = [];
                            let memberData = await api.findOneAsync(sequelize, "Member", { where: { 'id': item } });
                            let partitionUnitData = {
                                type: "Unit",
                                type_id: memberData.unit_id,
                                dead_member_id: req.body.dead_member_id,
                                amount: Math.round((2 / 100) * amountData.amount),
                                created_on: moment(new Date()).format("X"),
                                created_by: req.user.user_id
                            }
                            partitionArray.push(partitionUnitData);
                            let partitionAreaData = {
                                type: "Area",
                                type_id: memberData.area_id,
                                dead_member_id: req.body.dead_member_id,
                                amount: Math.round((2 / 100) * amountData.amount),
                                created_on: moment(new Date()).format("X"),
                                created_by: req.user.user_id
                            }
                            partitionArray.push(partitionAreaData);
                            let partitionDistrictData = {
                                type: "Area",
                                type_id: 0,
                                dead_member_id: req.body.dead_member_id,
                                amount: Math.round((2 / 100) * amountData.amount),
                                created_on: moment(new Date()).format("X"),
                                created_by: req.user.user_id
                            }
                            partitionArray.push(partitionDistrictData);
                            let partitionCollectorData = {
                                type: "Collector",
                                type_id: req.body.collector_id,
                                dead_member_id: req.body.dead_member_id,
                                amount: Math.round((4 / 100) * amountData.amount),
                                created_on: moment(new Date()).format("X"),
                                created_by: req.user.user_id
                            }
                            partitionArray.push(partitionCollectorData);
                            await api.bulkCreateAsync(sequelize, 'CollectionPartition', partitionArray)
                        })
                    }
                    
                    return res.json({ "status": status, "data": data })
                }
            });
        }
        catch (err) {
            logger.error("Collection Update Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
}


module.exports = new Collection()


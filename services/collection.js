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
            var collection_data = {
                'member_id': req.body.member_id ? req.body.member_id : null,
                'dead_member_id': req.body.dead_member_id ? req.body.dead_member_id : null,
                'collector_id': req.body.collector_id ? req.body.collector_id : null,
                'collector_type': req.body.collector_type ? req.body.collector_type : null,
                'amount_id': req.body.amount_id ? req.body.amount_id : null,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
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
    async createBulkCollection(collectionArray,transaction,sequelize,logger) {
        try {
            if (!collectionArray) {
                return { "status": "error", "message": "Collection Array is required!" };
            }
            // inserting collection
            var result = await api.bulkCreateT(sequelize, "Collection", collectionArray,transaction);
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
        var limit = req.body.limit ? req.body.limit : 10
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var collection_condition = {}
        try {  
            if (utils.isNotUndefined(req.body.id)) {
                collection_condition.id = req.body.id;
            } 
            if (utils.isNotUndefined(req.body.member_id)) {
                collection_condition.member_id = req.body.member_id;
            } 
            if (utils.isNotUndefined(req.body.member_id)) {
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
}


module.exports = new Collection()


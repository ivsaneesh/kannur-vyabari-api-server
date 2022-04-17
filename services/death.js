"use strict";
var path = require('path')
var moment = require('moment')
var path_services = path.normalize(__dirname + "/../services")
var utils = require("../helper/utils");
const collection = require(path_services + '/collection');
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
class Death {

    constructor() {

    }
    async createDeath(req, res) {
        var transaction;
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!req.body.member_id) {
                return res.json({ "status": "error", "message": "member id is required!" });
            }
            if (!req.body.date_time) {
                return res.json({ "status": "error", "message": "date is required!" });
            }
            if (!req.body.details) {
                return res.json({ "status": "error", "message": "details is required!" });
            }
            if (!req.body.venue) {
                return res.json({ "status": "error", "message": "venue is required!" });
            }
            if (!req.body.amount_id) {
                return res.json({ "status": "error", "message": "amount id is required!" });
            }
            var death_data = {
                'member_id': req.body.member_id ? req.body.member_id : null,
                'datetime': req.body.date_time ? req.body.date_time : null,
                'details': req.body.details ? req.body.details : null,
                'venue': req.body.venue ? req.body.venue : null,
                'last_time': req.body.last_time ? req.body.last_time : null,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            var member_data = {
                'active': 0,
                'dead': 1
            }
            var member_condition={where:{'id': req.body.member_id}}
            transaction = await sequelize.sequelize.transaction();
            // inserting user permission
            var death_create = api.createT(sequelize, "Death", death_data, transaction);
            var member_update = api.updateCustomT(sequelize, "Member", member_data, member_condition, transaction);
            let [death_create_result, member_update_result] = await Promise.all([death_create, member_update]);
            if(death_create_result){
                var json_obj = { where: { dead: 0, active: 1}, attributes:[ 'id' ]   }
                var member_result = await api.findAllAsync(sequelize, "Member", json_obj);
                var collection_array = [];
                member_result.forEach((member) => {
                    collection_array.push({
                        member_id: member.id,
                        dead_member_id: death_create_result.id,
                        collector_type: req.body.collector_type ? req.body.collector_type : null,
                        amount_id : req.body.amount_id ? req.body.amount_id : null,
                        paid: 0,
                        created_on: req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
                    })
                })
            await collection.createBulkCollection(collection_array,transaction,sequelize,logger)
            }
            await transaction.commit();
            return res.json({ "status": 'success', "data": death_create_result });
        }
        catch (err) {
            logger.error("Death Create Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async listDeath(req, res) {
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
            var include = [{ model: sequelize.models.Business, as: "Business"},{ model: sequelize.models.Family, as: "Family"},{ model: sequelize.models.Nominee, as: "Nominee"}]
            var json_obj = { where: collection_condition, include: include }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "Death", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Death List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
}


module.exports = new Death()


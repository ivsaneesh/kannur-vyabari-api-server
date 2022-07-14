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
        const Op = sequelize.Sequelize.Op
        try {
            var plusAmountResult = null;
            var defaultAmountResult = null;

            if (!req.body.member_id) {
                return res.json({ "status": "error", "message": "member id is required!" });
            }
            if (!req.body.date_time) {
                return res.json({ "status": "error", "message": "date is required!" });
            }
            if (req.body.plus_member == null) {
                return res.json({ "status": "error", "message": "plus_member is required!" });
            }
            if (typeof req.body.plus_member != "boolean") {
                return res.json({ "status": "error", "message": "plus_member must be true or false!" });
            }

            /// if dead member is plus member
            if (req.body.plus_member == true) {
                /// check if there is a collection amount with type plus_member
                plusAmountResult = await api.findOneAsync(sequelize, "CollectionAmount", { where: { 'deleted': 0, 'type': 'plus_member' }, attributes: ['id'] });
                /// if no collection amount with type plus_member is found return 
                if (!plusAmountResult || !plusAmountResult.id) {
                    return res.json({ "status": "error", "message": "Could not find a active plus_member collection amount. Create a plus_member collection amount!" });
                }

                /// check if there is a collection amount with type default
                defaultAmountResult = await api.findOneAsync(sequelize, "CollectionAmount", { where: { 'deleted': 0, 'type': 'default' }, attributes: ['id'] });
                /// if no collection amount with type default is found return 
                if (!defaultAmountResult || !defaultAmountResult.id) {
                    return res.json({ "status": "error", "message": "Could not find a active default collection amount. Create a default collection amount!" });
                }
            }
            /// if dead member is not plus member
            if (req.body.plus_member == false) {
                /// check if there is a collection amount with type default
                defaultAmountResult = await api.findOneAsync(sequelize, "CollectionAmount", { where: { 'deleted': 0, 'type': 'default' }, attributes: ['id'] });
                /// if no collection amount with type default is found return 
                if (!defaultAmountResult || !defaultAmountResult.id) {
                    return res.json({ "status": "error", "message": "Could not find a active default collection amount. Create a default collection amount!" });
                }
            }


            // fetch active collection amount
            // var amount_condition = { where: { 'deleted': 0 } }
            // var amountResult = await api.findOneAsync(sequelize, "CollectionAmount", amount_condition);
            // if (!amountResult && !amountResult.id) {
            //     return res.json({ "status": "error", "message": "Active amount not exist. Create new collection amount" });
            // }
            // else {
            //     console.log(amountResult);
            // }

            var death_data = {
                'member_id': req.body.member_id ? req.body.member_id : null,
                'datetime': req.body.date_time ? req.body.date_time : null,
                'details': req.body.details ? req.body.details : null,
                'venue': req.body.venue ? req.body.venue : null,
                'last_date': req.body.last_date ? req.body.last_date : null,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X"),
                'created_by': req.user.user_id,

            }
            var member_data = {
                'active': 0,
                'dead': 1
            }
            var member_condition = { where: { 'id': req.body.member_id } }
            transaction = await sequelize.sequelize.transaction();
            // inserting user permission
            var death_create = api.createT(sequelize, "Death", death_data, transaction);
            var member_update = api.updateCustomT(sequelize, "Member", member_data, member_condition, transaction);
            let [death_create_result, member_update_result] = await Promise.all([death_create, member_update]);
            if (death_create_result) {
                var json_obj = {};
                var collection_array = [];
                // if dead member is not a plus_member only normal members has to pay the contribution
                if (req.body.plus_member == false) {
                    var today = new Date();
                    var date = new Date(today.getFullYear() - 65, today.getMonth(), today.getDate());
                    var date65 = moment(date).format("X");
                    json_obj = { where: { dead: 0, active: 1, date_of_birth: { [Op.lt]: date65 } }, attributes: ['id', 'date_of_birth'] }
                    var member_result = await api.findAllAsync(sequelize, "Member", json_obj);

                    member_result.forEach((member) => {
                        var amountId = defaultAmountResult.id;
                        collection_array.push({
                            member_id: member.id,
                            dead_member_id: req.body.member_id,
                            collector_type: req.body.collector_type ? req.body.collector_type : null,
                            amount_id: amountId,
                            paid: 0,
                            created_on: req.body.created_on ? req.body.created_on : moment(new Date()).format("X"),
                            created_by: req.user.user_id,

                        })
                    })
                }
                else {
                    // dead member is a plus_member both plus_member and normal members has to pay the contribution
                    json_obj = { where: { dead: 0, active: 1 }, attributes: ['id', 'date_of_birth'] }
                    var member_result = await api.findAllAsync(sequelize, "Member", json_obj);
                    member_result.forEach((member) => {
                        var amountId = defaultAmountResult.id;
                        if (this.checkIsPlusMember(member.date_of_birth) === true) {
                            amountId = plusAmountResult.id;
                        }
                        else {
                            amountId = defaultAmountResult.id
                        }
                        collection_array.push({
                            member_id: member.id,
                            dead_member_id: req.body.member_id,
                            collector_type: req.body.collector_type ? req.body.collector_type : null,
                            amount_id: amountId,
                            paid: 0,
                            created_on: req.body.created_on ? req.body.created_on : moment(new Date()).format("X"),
                            created_by: req.user.user_id,

                        })
                    })
                }

                await collection.createBulkCollection(collection_array, transaction, sequelize, logger)
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
            var include = [{ model: sequelize.models.Business, as: "Business" }, { model: sequelize.models.Family, as: "Family" }, { model: sequelize.models.Nominee, as: "Nominee" }]
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

    checkIsPlusMember(dob) {
        var today = new Date();
        var date = new Date(today.getFullYear() - 65, today.getMonth(), today.getDate());
        var date65 = moment(date).format("X");
        if (date65 < dob) {
            console.log("IsPlusMember", false);
            return false;
        } else {
            console.log("IsPlusMember", true);
            return true;
        }
    }
}


module.exports = new Death()


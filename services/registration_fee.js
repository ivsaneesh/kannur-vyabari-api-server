"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
class RegistrationFee {

    constructor() { }

    async createRegistratioFee(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.amount)) {
                return res.json({ "status": "error", "message": "Amount is required!" });
            }

            var fee_data = {
                'amount': req.body.amount,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            var feeResult = await api.createAsync(sequelize, "RegistrationFee", fee_data);
            return res.json({ "status": 'success', "data": feeResult });
        }
        catch (err) {
            logger.error("RegistrationFee Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    async listRegistratioFee(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var fee_condition = {}
        try {

            if (utils.isNotUndefined(req.body.id)) {
                fee_condition.id = req.body.id;
            } 
            if (utils.isNotUndefined(req.body.amount)) {
                fee_condition.amount = req.body.amount;
            }
            if (utils.isNotUndefined(req.body.deleted)) {
                fee_condition.deleted = req.body.deleted;
            }

            var json_obj = { where: fee_condition }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "RegistrationFee", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("RegistrationFee List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    
    async deleteRegistratioFee(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.registration_fee_id)) {
                return res.json({ "status": "error", "message": "Registration fee id is required!" });
            }
            const fee_data = {}
            fee_data.deleted = 1;
            fee_data.modified_on = moment(new Date()).format("X");

            var condition = { where: { 'id': req.body.entity_id } };

            // updating Registration Fee to deleted 1
            api.updateCustom(sequelize, 'RegistrationFee', fee_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data, "message": message })
                }
            });
        }
        catch (err) {
            logger.error("RegistrationFee delete Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

}

module.exports = new RegistrationFee();

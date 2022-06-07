"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
class ExternalEntity {

    constructor() { }

    async createExternalEntity(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.full_name)) {
                return res.json({ "status": "error", "message": "Full name is required!" });
            }
            if (!utils.isNotUndefined(req.body.type)) {
                return res.json({ "status": "error", "message": "Type is required!" });
            }

            var entity_data = {
                'full_name': req.body.full_name,
                'type': req.body.type,
                'aadhar': req.body.aadhar ? req.body.aadhar : null,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            var entityResult = await api.createAsync(sequelize, "ExternalEntity", entity_data);
            return res.json({ "status": 'success', "data": entityResult });
        }
        catch (err) {
            logger.error("ExternalEntity Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    async listExternalEntity(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var entity_condition = {}
        try {

            if (utils.isNotUndefined(req.body.id)) {
                entity_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.search)) {
                entity_condition = { [Op.or]: [{ full_name: { [Op.like]: '%' + req.body.search + '%' }, type: { [Op.like]: '%' + req.body.search + '%' } }] };
            }
            if (utils.isNotUndefined(req.body.aadhar)) {
                entity_condition.aadhar = req.body.aadhar;
            }
            if (utils.isNotUndefined(req.body.deleted)) {
                entity_condition.deleted = req.body.deleted;
            }

            var json_obj = { where: entity_condition }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "ExternalEntity", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("ExternalEntity List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    async updateExternalEntity(req, res) {
        var sequelize = req.app.get('sequelize')
        const Op = sequelize.Sequelize.Op;
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.entity_id)) {
                return res.json({ "status": "error", "message": "Entity id is required!" });
            }
            const entity_data = {}
            if (utils.isNotUndefined(req.body.full_name)) entity_data.full_name = req.body.full_name;
            if (utils.isNotUndefined(req.body.aadhar)) entity_data.aadhar = req.body.aadhar;
            if (utils.isNotUndefined(req.body.type)) entity_data.type = req.body.type;

            entity_data.modified_on = moment(new Date()).format("X");

            var condition = { where: { 'id': req.body.entity_id } };

            api.updateCustom(sequelize, 'ExternalEntity', entity_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data, "message": message })
                }
            });
        }
        catch (err) {
            logger.error("ExternalEntity Update Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    async deleteExternalEntity(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.entity_id)) {
                return res.json({ "status": "error", "message": "Entity id is required!" });
            }
            const entity_data = {}
            entity_data.deleted = 1;
            entity_data.modified_on = moment(new Date()).format("X");

            var condition = { where: { 'id': req.body.entity_id } };

            // updating entity to deleted 1
            api.updateCustom(sequelize, 'ExternalEntity', entity_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data, "message": message })
                }
            });
        }
        catch (err) {
            logger.error("ExternalEntity delete Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
}

module.exports = new ExternalEntity()

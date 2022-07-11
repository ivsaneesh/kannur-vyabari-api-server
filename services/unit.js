"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
class Unit {

    constructor() {

    }
    async createUnit(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.name)) {
                return res.json({ "status": "error", "message": "Name is required!" });
            }
            if (!utils.isNotUndefined(req.body.area_id)) {
                return res.json({ "status": "error", "message": "Area id is required!" });
            }
            if (!utils.isNotUndefined(req.body.id_number)) {
                return res.json({ "status": "error", "message": "Unit id number is required!" });
            }

            // check if unit id number exist
            var unitIdResult = await api.findOneAsync(sequelize, "Unit", { where: { 'id_number': req.body.id_number } });
            if (unitIdResult && unitIdResult.id_number) {
                return res.json({ "status": "error", "message": "Unit code already exist!" });
            }
            var unit_data = {
                'name': req.body.name ? req.body.name : null,
                'address': req.body.address ? req.body.address : null,
                'mobile': req.body.mobile ? req.body.mobile : null,
                'id_number': req.body.id_number ? req.body.id_number : null,
                'manager_id': req.body.manager_id ? req.body.manager_id : null,
                'area_id': req.body.area_id,
                'manager_type': req.body.manager_type ? req.body.manager_type : null,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X"),
                'created_by': req.user.user_id,
            }
            // inserting user permission
            var unitResult = await api.createAsync(sequelize, "Unit", unit_data);
            return res.json({ "status": 'success', "data": unitResult });
        }
        catch (err) {
            logger.error("User Create Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async listUnit(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var unit_condition = {}
        try {

            if (utils.isNotUndefined(req.body.id)) {
                unit_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.search)) {
                unit_condition = { [Op.or]: [{ name: { [Op.like]: '%' + req.body.search + '%' } }, { id_number: { [Op.like]: '%' + req.body.search + '%' } }] };
            }
            if (utils.isNotUndefined(req.body.manager_id)) {
                unit_condition.manager_id = req.body.manager_id;
            }
            if (utils.isNotUndefined(req.body.id_number)) {
                unit_condition.id_number = req.body.id_number;
            }
            if (utils.isNotUndefined(req.body.area_id)) {
                unit_condition.area_id = req.body.area_id;
            }
            unit_condition.deleted = 0;
            var include = [{ model: sequelize.models.Area, as: "Area", attributes: ['id', 'name', 'id_number'] }];
            var json_obj = { where: unit_condition, include: include }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            else {
                json_obj.order = [['id_number', "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "Unit", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Unit List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async updateUnit(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.unit_id)) {
                return res.json({ "status": "error", "message": "Unit id is required!" });
            }
            const unit_data = {}
            if (utils.isNotUndefined(req.body.name)) unit_data.name = req.body.name;
            if (utils.isNotUndefined(req.body.address)) unit_data.address = req.body.address;
            if (utils.isNotUndefined(req.body.mobile)) unit_data.mobile = req.body.mobile;
            if (utils.isNotUndefined(req.body.manager_type)) unit_data.manager_type = req.body.manager_type;
            if (utils.isNotUndefined(req.body.manager_id)) unit_data.manager_id = req.body.manager_id;
            if (utils.isNotUndefined(req.body.area_id)) unit_data.area_id = req.body.area_id;
            unit_data.modified_on = moment(new Date()).format("X");

            var condition = { where: { 'id': req.body.unit_id } };

            // updating unit
            api.updateCustom(sequelize, 'Unit', unit_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data, "message": message })
                }
            });
        }
        catch (err) {
            logger.error("unit update Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async deleteUnit(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.unit_id)) {
                return res.json({ "status": "error", "message": "Unit id is required!" });
            }
            const unit_data = {}
            unit_data.deleted = 1;
            unit_data.modified_on = moment(new Date()).format("X");

            var condition = { where: { 'id': req.body.unit_id } };

            // updating unit to deleted to 1
            api.updateCustom(sequelize, 'Unit', unit_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data, "message": message })
                }
            });
        }
        catch (err) {
            logger.error("Unit delete Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async updateUnit(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.unit_id)) {
                return res.json({ "status": "error", "message": "Unit id is required!" });
            }

            const unit_data = {}
            if (utils.isNotUndefined(req.body.name)) unit_data.name = req.body.name;
            if (utils.isNotUndefined(req.body.address)) unit_data.address = req.body.address;
            if (utils.isNotUndefined(req.body.mobile)) unit_data.mobile = req.body.mobile;
            if (utils.isNotUndefined(req.body.manager_type)) unit_data.manager_type = req.body.manager_type;
            if (utils.isNotUndefined(req.body.manager_id)) unit_data.manager_id = req.body.manager_id;
            if (utils.isNotUndefined(req.body.area_id)) unit_data.area_id = req.body.area_id;
            if (utils.isNotUndefined(req.body.id_number)) {
                // check if unit id number exist
                var unitIdResult = await api.findOneAsync(sequelize, "Unit", { where: { 'id': req.body.unit_id } });
                if (unitIdResult) {
                    if (unitIdResult.id_number == req.body.id_number) {
                        unit_data.id_number = req.body.id_number;
                    }
                    else {
                        var unitIdResult = await api.findOneAsync(sequelize, "Unit", { where: { 'id_number': req.body.id_number, 'deleted': 0, } });
                        if (unitIdResult && unitIdResult.id_number) {
                            return res.json({ "status": "error", "message": "Unit code already exist!" });
                        }
                        unit_data.id_number = req.body.id_number;
                    }
                } else {
                    unit_data.id_number = req.body.id_number;
                }
            }
            unit_data.modified_on = moment(new Date()).format("X");
            unit_data.modified_by = req.user.user_id;

            var condition = { where: { 'id': req.body.unit_id } };

            // updating unit
            api.updateCustom(sequelize, 'Unit', unit_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data, "message": message })
                }
            });
        }
        catch (err) {
            logger.error("unit update Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async deleteUnit(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.unit_id)) {
                return res.json({ "status": "error", "message": "Unit id is required!" });
            }
            const unit_data = {}
            unit_data.deleted = 1;
            unit_data.modified_on = moment(new Date()).format("X");
            unit_data.modified_by = req.user.user_id;

            var condition = { where: { 'id': req.body.unit_id } };

            // updating unit to deleted to 1
            api.updateCustom(sequelize, 'Unit', unit_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data, "message": message })
                }
            });
        }
        catch (err) {
            logger.error("Unit delete Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
}


module.exports = new Unit()


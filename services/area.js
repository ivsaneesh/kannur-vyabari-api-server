"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
class Area {

    constructor() {

    }
    async createArea(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.name)) {
                return res.json({ "status": "error", "message": "Name is required!" });
            }
            if (!utils.isNotUndefined(req.body.id_number)) {
                return res.json({ "status": "error", "message": "Area id number is required!" });
            }

            // check if Area id number exist
            var areaIdResult = await api.findOneAsync(sequelize, "Area", { where: { 'id_number': req.body.id_number } });
            if (areaIdResult && areaIdResult.id_number) {
                return res.json({ "status": "error", "message": "Area code already exist!" });
            }

            var area_data = {
                'name': req.body.name ? req.body.name : null,
                'address': req.body.address ? req.body.address : null,
                'mobile': req.body.mobile ? req.body.mobile : null,
                'id_number': req.body.id_number,
                'manager_id': req.body.manager_id ? req.body.manager_id : null,
                'manager_type': req.body.manager_type ? req.body.manager_type : null,
                'created_by': req.user.user_id,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            // inserting user permission
            var areaResult = await api.createAsync(sequelize, "Area", area_data);
            return res.json({ "status": 'success', "data": areaResult });
        }
        catch (err) {
            logger.error("User Create Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async listArea(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var area_condition = {}
        try {

            if (utils.isNotUndefined(req.body.id)) {
                area_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.search)) {
                area_condition = { [Op.or]: [{ name: { [Op.like]: '%' + req.body.search + '%' } }] };
            }
            if (utils.isNotUndefined(req.body.manager_id)) {
                area_condition.manager_id = req.body.manager_id;
            }
            if (utils.isNotUndefined(req.body.id_number)) {
                area_condition.id_number = req.body.id_number;
            }
            area_condition.deleted = 0;

            var json_obj = { where: area_condition }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "Area", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Area List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async updateArea(req, res) {
        var sequelize = req.app.get('sequelize')
        const Op = sequelize.Sequelize.Op;
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.area_id)) {
                return res.json({ "status": "error", "message": "area id is required!" });
            }
            // check if Area id number exist
            var areaIdResult = await api.findOneAsync(sequelize, "Area", { where: { 'id_number': req.body.id_number, 'deleted': 0, 'id': { [Op.not]: req.body.area_id } } });
            if (areaIdResult && areaIdResult.id_number) {
                return res.json({ "status": "error", "message": "Area code already exist!" });
            }
            const area_data = {}
            if (utils.isNotUndefined(req.body.name)) area_data.name = req.body.name;
            if (utils.isNotUndefined(req.body.address)) area_data.address = req.body.address;
            if (utils.isNotUndefined(req.body.mobile)) area_data.mobile = req.body.mobile;
            if (utils.isNotUndefined(req.body.manager_type)) area_data.manager_type = req.body.manager_type;
            if (utils.isNotUndefined(req.body.manager_id)) area_data.manager_id = req.body.manager_id;
            if (utils.isNotUndefined(req.body.id_number)) {
                // check if Area id number exist
                var areaIdResult = await api.findOneAsync(sequelize, "Area", { where: { 'id': req.body.area_id } });
                if (areaIdResult) {
                    if (areaIdResult.id_number == req.body.id_number) {
                        area_data.id_number = req.body.id_number;
                    }
                    else {
                        var areaIdResult = await api.findOneAsync(sequelize, "Area", { where: { 'id_number': req.body.id_number, 'deleted': 0, } });
                        if (areaIdResult && areaIdResult.id_number) {
                            return res.json({ "status": "error", "message": "Area code already exist!" });
                        }
                        area_data.id_number = req.body.id_number;
                    }
                } else {
                    area_data.id_number = req.body.id_number;
                }
            }
            area_data.modified_on = moment(new Date()).format("X");
            area_data.modified_by = req.user.user_id;
            var condition = { where: { 'id': req.body.area_id } };

            // updating area
            api.updateCustom(sequelize, 'Area', area_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data, "message": message })
                }
            });
        }
        catch (err) {
            logger.error("Area Update Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async deleteArea(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.area_id)) {
                return res.json({ "status": "error", "message": "area id is required!" });
            }
            const area_data = {}
            area_data.deleted = 1;
            area_data.modified_on = moment(new Date()).format("X");
            area_data.modified_by = req.user.user_id;

            var condition = { where: { 'id': req.body.area_id } };

            // updating area to deleted 1
            api.updateCustom(sequelize, 'Area', area_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data, "message": message })
                }
            });
        }
        catch (err) {
            logger.error("Area delete Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
}


module.exports = new Area()


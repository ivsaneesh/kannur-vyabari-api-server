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
                return res.json({ "status": "error", "message": "Id number is required!" });
            }
            if (!utils.isNotUndefined(req.body.manager_id)) {
                return res.json({ "status": "error", "message": "Manager id is required!" });
            }
            if (!utils.isNotUndefined(req.body.manager_type)) {
                return res.json({ "status": "error", "message": "manager type is required!" });
            }
            if (!utils.isNotUndefined(req.body.address)) {
                return res.json({ "status": "error", "message": "address is required!" });
            }
            if (!utils.isValidMobile(req.body.mobile)) {
                return res.json({ "status": "error", "message": "mobile is required!" });
            }
            var area_data = {
                'name': req.body.name ? req.body.name : null,
                'address': req.body.address ? req.body.address : null,
                'mobile': req.body.mobile ? req.body.mobile : null,
                'id_number': req.body.id_number ? req.body.id_number : null,
                'manager_id': req.body.manager_id ? req.body.manager_id : null,
                'area_id': req.body.area_id ? req.body.area_id : null,
                'manager_type': req.body.manager_type ? req.body.manager_type : null,
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
        var limit = req.body.limit ? req.body.limit : 10
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var area_condition = {}
        try {   

            if (utils.isNotUndefined(req.body.id)) {
                area_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.search)) {
                area_condition = { [Op.or]: [{ name: { [Op.like]: '%' + req.body.search + '%' } }, { middle_name: { [Op.like]: '%' + req.body.search + '%' } }, { last_name: { [Op.like]: '%' + req.body.search + '%' } }] };
            }
            if (utils.isNotUndefined(req.body.manager_id)) {
                area_condition.manager_id = req.body.manager_id;
            }
            if (utils.isNotUndefined(req.body.id_number)) {
                area_condition.id_number = req.body.id_number;
            }
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
}


module.exports = new Area()


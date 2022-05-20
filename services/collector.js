"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
class Collector {

    constructor() {

    }
    async createCollector(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try { 
            if (!utils.isNotUndefined(req.body.first_name)) {
                return res.json({ "status": "error", "message": "First name is required!" });
            }
            if (!utils.isValidMobile(req.body.mobile)) {
                return res.json({ "status": "error", "message": "Mobile is required!" });
            }
            if (!utils.isNotUndefined(req.body.address)) {
                return res.json({ "status": "error", "message": "address is required!" });
            }
            if (!utils.isNotUndefined(req.body.aadhar)) {
                return res.json({ "status": "error", "message": "aadhar is required!" });
            }
            if (!utils.isNotUndefined(req.body.area_id)) {
                return res.json({ "status": "error", "message": "area id is required!" });
            }
            if (!utils.isNotUndefined(req.body.unit_id)) {
                return res.json({ "status": "error", "message": "Unit id is required!" });
            }
            var collector_data = {
                'first_name': req.body.first_name ? req.body.first_name : null,
                'middle_name': req.body.middle_name ? req.body.middle_name : null,
                'last_name': req.body.last_name ? req.body.last_name : null,
                'address': req.body.address ? req.body.address : null,
                'mobile': req.body.mobile ? req.body.mobile : null,
                'aadhar': req.body.aadhar ? req.body.aadhar : null,
                'area_id': req.body.area_id ? req.body.area_id : null,
                'unit_id': req.body.unit_id ? req.body.unit_id : null,
                'designation': req.body.designation ? req.body.designation : null,
                'details': req.body.details ? req.body.details : null,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            // inserting user permission
            var collectorResult = await api.createAsync(sequelize, "Collector", collector_data);
            return res.json({ "status": 'success', "data": collectorResult });
        }
        catch (err) {
            logger.error("User Create Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async listCollector(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var collector_condition = {}
        try {   

            if (utils.isNotUndefined(req.body.id)) {
                collector_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.search)) {
                collector_condition = { [Op.or]: [{ mobile: { [Op.like]: '%' + req.body.search + '%' } },{ first_name: { [Op.like]: '%' + req.body.search + '%' } }, { middle_name: { [Op.like]: '%' + req.body.search + '%' } }, { last_name: { [Op.like]: '%' + req.body.search + '%' } }] };
            }
            if (utils.isNotUndefined(req.body.area_id)) {
                collector_condition.area_id = req.body.area_id;
            }
            if (utils.isNotUndefined(req.body.unit_id)) {
                collector_condition.unit_id = req.body.unit_id;
            }
            var json_obj = { where: collector_condition }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "Collector", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Collector List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
}


module.exports = new Collector()


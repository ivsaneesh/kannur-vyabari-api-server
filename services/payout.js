"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
class Payout {

    constructor() {

    }
    async createMemberPayout(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.member_id)) {
                return res.json({ "status": "error", "message": "Member id is required!" });
            }
            if (!utils.isNotUndefined(req.body.given)) {
                return res.json({ "status": "error", "message": "Given amount is required!" });
            }

            var area_data = {
                'member_id': req.body.member_id ? req.body.member_id : null,
                'given': req.body.given ? req.body.given : null,
                'deduction': req.body.deduction ? req.body.deduction : null,
                'collected': req.body.collected ? req.body.collected : null,
                'deduction_reason': req.body.deduction_reason ? req.body.deduction_reason : null,
                'due': req.body.due ? req.body.due : null,
                'payout_date': req.body.payout_date ? req.body.payout_date : null,
                'details': req.body.details ? req.body.details : null,
                'cheque_id': req.body.cheque_id ? req.body.cheque_id : null,
                'created_by': req.user.user_id,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            // inserting user permission
            var memberPayoutResult = await api.createAsync(sequelize, "MemberPayout", area_data);
            return res.json({ "status": 'success', "data": memberPayoutResult });
        }
        catch (err) {
            logger.error("MemberPayout Create Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async listMemberPayout(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var member_payout_condition = {}
        try {

            if (utils.isNotUndefined(req.body.id)) {
                member_payout_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.member_id)) {
                member_payout_condition.member_id = req.body.member_id;
            }

            var json_obj = { where: member_payout_condition }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "MemberPayout", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Member Payout List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async createAreaPayout(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.area_id)) {
                return res.json({ "status": "error", "message": "Area id is required!" });
            }
            if (!utils.isNotUndefined(req.body.amount)) {
                return res.json({ "status": "error", "message": "Amount is required!" });
            }
    
            var area_data = {
                'area_id': req.body.area_id ? req.body.area_id : null,
                'amount': req.body.amount ? req.body.amount : null,
                'modified_on': req.body.modified_on ? req.body.modified_on : null,
                'details': req.body.details ? req.body.details : null,
                'cheque_id': req.body.cheque_id ? req.body.cheque_id : null,
                'deleted': 0,
                'created_by': req.user.user_id,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            // inserting user permission
            var areaPayoutResult = await api.createAsync(sequelize, "AreaPayout", area_data);
            return res.json({ "status": 'success', "data": areaPayoutResult });
        }
        catch (err) {
            logger.error("AreaPayout Create Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async listAreaPayout(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var area_payout_condition = {}
        try {
    
            if (utils.isNotUndefined(req.body.id)) {
                area_payout_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.area_id)) {
                area_payout_condition.area_id = req.body.area_id;
            }
    
            var json_obj = { where: area_payout_condition }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "AreaPayout", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Area Payout List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async createUnitPayout(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.unit_id)) {
                return res.json({ "status": "error", "message": "Unit id is required!" });
            }
            if (!utils.isNotUndefined(req.body.amount)) {
                return res.json({ "status": "error", "message": "Amount is required!" });
            }
    
            var unit_data = {
                'unit_id': req.body.unit_id ? req.body.unit_id : null,
                'amount': req.body.amount ? req.body.amount : null,
                'modified_on': req.body.modified_on ? req.body.modified_on : null,
                'details': req.body.details ? req.body.details : null,
                'cheque_id': req.body.cheque_id ? req.body.cheque_id : null,
                'deleted': 0,
                'created_by': req.user.user_id,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            // inserting user permission
            var unitPayoutResult = await api.createAsync(sequelize, "UnitPayout", unit_data);
            return res.json({ "status": 'success', "data": unitPayoutResult });
        }
        catch (err) {
            logger.error("UnitPayout Create Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async listUnitPayout(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var unit_payout_condition = {}
        try {
    
            if (utils.isNotUndefined(req.body.id)) {
                unit_payout_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.unit_id)) {
                unit_payout_condition.unit_id = req.body.unit_id;
            }
    
            var json_obj = { where: unit_payout_condition }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "UnitPayout", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Unit Payout List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async createDistrictPayout(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.district_id)) {
                return res.json({ "status": "error", "message": "District id is required!" });
            }
            if (!utils.isNotUndefined(req.body.amount)) {
                return res.json({ "status": "error", "message": "Amount is required!" });
            }
    
            var district_data = {
                'district_id': req.body.district_id ? req.body.district_id : null,
                'amount': req.body.amount ? req.body.amount : null,
                'modified_on': req.body.modified_on ? req.body.modified_on : null,
                'details': req.body.details ? req.body.details : null,
                'cheque_id': req.body.cheque_id ? req.body.cheque_id : null,
                'deleted': 0,
                'created_by': req.user.user_id,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            // inserting user permission
            var districtPayoutResult = await api.createAsync(sequelize, "DistrictPayout", district_data);
            return res.json({ "status": 'success', "data": districtPayoutResult });
        }
        catch (err) {
            logger.error("DistrictPayout Create Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async listDistrictPayout(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var district_payout_condition = {}
        try {
    
            if (utils.isNotUndefined(req.body.id)) {
                district_payout_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.district_id)) {
                district_payout_condition.district_id = req.body.district_id;
            }
    
            var json_obj = { where: district_payout_condition }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "DistrictPayout", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("District Payout List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async createCollectorPayout(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.collector_id)) {
                return res.json({ "status": "error", "message": "Collector id is required!" });
            }
            if (!utils.isNotUndefined(req.body.amount)) {
                return res.json({ "status": "error", "message": "Amount is required!" });
            }
    
            var collector_data = {
                'collector_id': req.body.collector_id ? req.body.collector_id : null,
                'amount': req.body.amount ? req.body.amount : null,
                'modified_on': req.body.modified_on ? req.body.modified_on : null,
                'details': req.body.details ? req.body.details : null,
                'cheque_id': req.body.cheque_id ? req.body.cheque_id : null,
                'deleted': 0,
                'created_by': req.user.user_id,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            // inserting user permission
            var collectorPayoutResult = await api.createAsync(sequelize, "CollectorPayout", collector_data);
            return res.json({ "status": 'success', "data": collectorPayoutResult });
        }
        catch (err) {
            logger.error("CollectorPayout Create Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    async listCollectorPayout(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var collector_payout_condition = {}
        try {
    
            if (utils.isNotUndefined(req.body.id)) {
                collector_payout_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.collector_id)) {
                collector_payout_condition.collector_id = req.body.collector_id;
            }
    
            var json_obj = { where: collector_payout_condition }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "CollectorPayout", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Collector Payout List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
}


module.exports = new Payout()


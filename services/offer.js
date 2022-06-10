"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
class Offer {

    constructor() { }

    async createOffer(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.name)) {
                return res.json({ "status": "error", "message": "Name is required!" });
            }
            if (!utils.isNotUndefined(req.body.type)) {
                return res.json({ "status": "error", "message": "Type is required!" });
            }

            var offer_data = {
                'name': req.body.name,
                'type': req.body.type,
                'value': req.body.value ? req.body.value : null,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            var offerResult = await api.createAsync(sequelize, "Offer", offer_data);
            return res.json({ "status": 'success', "data": offerResult });
        }
        catch (err) {
            logger.error("Offer Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    async listOffer(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var offer_condition = {}
        try {

            if (utils.isNotUndefined(req.body.id)) {
                offer_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.search)) {
                offer_condition = { [Op.or]: [{ name: { [Op.like]: '%' + req.body.search + '%' }, type: { [Op.like]: '%' + req.body.search + '%' } }] };
            }
            if (utils.isNotUndefined(req.body.value)) {
                offer_condition.value = req.body.value;
            }
            if (utils.isNotUndefined(req.body.created_on)) {
                offer_condition.created_on = req.body.created_on;
            }
            if (utils.isNotUndefined(req.body.deleted)) {
                offer_condition.deleted = req.body.deleted;
            }

            var json_obj = { where: offer_condition }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "Offer", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Offer List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    async updateOffer(req, res) {
        var sequelize = req.app.get('sequelize')
        const Op = sequelize.Sequelize.Op;
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.offer_id)) {
                return res.json({ "status": "error", "message": "Offer id is required!" });
            }
            const offer_data = {}
            if (utils.isNotUndefined(req.body.name)) offer_data.name = req.body.name;
            if (utils.isNotUndefined(req.body.value)) offer_data.value = req.body.value;
            if (utils.isNotUndefined(req.body.type)) offer_data.type = req.body.type;

            offer_data.modified_on = moment(new Date()).format("X");

            var condition = { where: { 'id': req.body.offer_id } };

            api.updateCustom(sequelize, 'Offer', offer_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data, "message": message })
                }
            });
        }
        catch (err) {
            logger.error("Offer Update Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
    
    async deleteOffer(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.offer_id)) {
                return res.json({ "status": "error", "message": "Offer id is required!" });
            }
            const offer_data = {}
            offer_data.deleted = 1;
            offer_data.deleted_on = moment(new Date()).format("X");

            var condition = { where: { 'id': req.body.offer_id } };

            // updating offer to deleted 1
            api.updateCustom(sequelize, 'Offer', offer_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data, "message": message })
                }
            });
        }
        catch (err) {
            logger.error("Offer delete Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
}

module.exports = new Offer()

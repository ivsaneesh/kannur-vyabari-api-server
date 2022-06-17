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
            if (!utils.isNotUndefined(req.body.external_entity_id)) {
                return res.json({ "status": "error", "message": "External entity_id is required!" });
            }

            var offer_data = {
                'name': req.body.name,
                'type': req.body.type,
                'value': req.body.value ? req.body.value : null,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X"),
                'created_by': req.user.user_id,
            }


            api.create(sequelize, 'Offers', offer_data, function (status, data, message) {
                var offerResult = data;
                var offer_given_data = {
                    'offer_id': data.id,
                    'external_entity_id': req.body.external_entity_id,
                    'expiry_date': req.body.expiry_date ? req.body.expiry_date : 0,
                    'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X"),
                    'created_by': req.user.user_id,
                }
                api.create(sequelize, "OfferGiven", offer_given_data, function (status, data, message) {
                    return res.json({ "status": 'success', "data": offerResult });
                });
            });
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
        var offer_given_condition = {}
        try {

            if (utils.isNotUndefined(req.body.offer_id)) {
                offer_given_condition.offer_id = req.body.offer_id;
            }
            if (utils.isNotUndefined(req.body.external_entity_id)) {
                offer_given_condition.external_entity_id = req.body.external_entity_id;
            }
            if (utils.isNotUndefined(req.body.expiry_date)) {
                offer_given_condition.expiry_date = req.body.expiry_date;
            }

            if (utils.isNotUndefined(req.body.search)) {
                offer_condition = { [Op.or]: [{ name: { [Op.like]: '%' + req.body.search + '%' } }, { type: { [Op.like]: '%' + req.body.search + '%' } }] };
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

            var include = [{ model: sequelize.models.Offers, as: "Offers", where: offer_condition, }];
            var json_obj = { where: offer_given_condition, include: include }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "OfferGiven", json_obj);
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
            offer_data.modified_by = req.user.user_id;

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

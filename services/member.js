"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
class Member {

    constructor() {

    }
    async createMember(req, res) {
        var transaction;
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {   
            if (!req.body.basic_details) {
                return res.json({ "status": "error", "message": "basic details is required!" });
            }
            if (!req.body.business_details) {
                return res.json({ "status": "error", "message": "business details is required!" });
            }
            if (!req.body.family_details) {
                return res.json({ "status": "error", "message": "family details is required!" });
            }
            if (!req.body.nominee_details) {
                return res.json({ "status": "error", "message": "nominee details is required!" });
            }
            if(!req.body.basic_details.created_on){
                req.body.basic_details.created_on = moment(new Date()).format("X");
            }
            if(!req.body.business_details.created_on){
                req.body.business_details.created_on = moment(new Date()).format("X");
            }
            if(!req.body.family_details.created_on){
                req.body.family_details.created_on = moment(new Date()).format("X");
            }
            if(!req.body.nominee_details.created_on){
                req.body.nominee_details.created_on = moment(new Date()).format("X");
            }
            transaction = await sequelize.sequelize.transaction();
            // inserting user permission
            var memberResult = await api.createT(sequelize, "Member", req.body.basic_details, transaction);
            if(!memberResult){
                transaction.rollback();
                return res.json({ "status": 'error', "message": "something went wrong" });
            }
            req.body.business_details.member_id = memberResult.id;
            req.body.family_details.member_id = memberResult.id;
            req.body.nominee_details.member_id = memberResult.id;
            var businessPromise = api.createT(sequelize, "Business", req.body.business_details, transaction);
            var familyPromise = api.createT(sequelize, "Family", req.body.family_details, transaction);
            var nomineePromise = api.createT(sequelize, "Nominee", req.body.nominee_details, transaction);
            let [businessResult, familyResult,nomineeResult] = await Promise.all([businessPromise, familyPromise,nomineePromise]);
            var result = {
                'Member': memberResult,
                'Business': businessResult,
                'Family': familyResult,
                'Nominee': nomineeResult
            }
            await transaction.commit();
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            transaction.rollback();
            logger.error("User Create Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
}


module.exports = new Member()


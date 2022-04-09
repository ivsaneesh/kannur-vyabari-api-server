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
            req.body.business_details.forEach((item)=>{
                if(!item.created_on){
                    item.created_on = moment(new Date()).format("X");
                }
            })
            req.body.family_details.forEach((item)=>{
                if(!item.created_on){
                    item.created_on = moment(new Date()).format("X");
                }
            })
            req.body.nominee_details.forEach((item)=>{
                if(!item.created_on){
                    item.created_on = moment(new Date()).format("X");
                }
            })
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
            var businessPromise = api.bulkCreateT(sequelize, "Business", req.body.business_details, transaction);
            var familyPromise = api.bulkCreateT(sequelize, "Family", req.body.family_details, transaction);
            var nomineePromise = api.bulkCreateT(sequelize, "Nominee", req.body.nominee_details, transaction);
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
    async listMember(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        const fn = sequelize.Sequelize.fn
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var member_condition = {}
        try {   

            if (utils.isNotUndefined(req.body.search)) {
                member_condition = { [Op.or]: [{ first_name: { [Op.like]: '%' + req.body.search + '%' } }, { middle_name: { [Op.like]: '%' + req.body.search + '%' } }, { last_name: { [Op.like]: '%' + req.body.search + '%' } }, { mobile: { [Op.like]: '%' + req.body.search + '%' } }] };
            }
            if (utils.isNotUndefined(req.body.from_dob) && utils.isNotUndefined(req.body.to_dob)) {
                member_condition.date_of_birth = { [Op.between]: [req.body.from_dob, req.body.to_dob] };
            } else if (utils.isNotUndefined(req.body.from_dob)) {
                member_condition.date_of_birth = { [Op.gte]: req.body.from_dob };
            } else if (utils.isNotUndefined(req.body.to_dob)) {
                member_condition.date_of_birth = { [Op.lte]: req.body.to_dob };
            }else if(utils.isNotUndefined(req.body.from_dob) && utils.isNotUndefined(req.body.to_dob) && req.body.from_dob == req.body.to_dob){
                member_condition.date_of_birth = req.body.from_dob;
            }
            if (utils.isNotUndefined(req.body.division_id)) {
                member_condition.division_id = req.body.division_id;
            }
            if (utils.isNotUndefined(req.body.unit_id)) {
                member_condition.unit_id = req.body.unit_id;
            }
            var include = [{ model: sequelize.models.Business, as: "Business"},{ model: sequelize.models.Family, as: "Family"},{ model: sequelize.models.Nominee, as: "Nominee"}]
            var json_obj = { where: member_condition, include: include }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "Member", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Member List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
}


module.exports = new Member()


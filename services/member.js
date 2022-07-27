"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
var path_services = path.normalize(__dirname + "/../services/")
var sms = require(path_services + '/sendsms')

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
            if (!req.body.basic_details.created_on) {
                req.body.basic_details.created_on = moment(new Date()).format("X");
            }
            req.body.basic_details.active = 1;
            /// create user id
            req.body.basic_details.created_by = req.user.user_id;
            req.body.business_details.forEach((item) => {
                item.created_by = req.user.user_id;
                if (!item.created_on) {
                    item.created_on = moment(new Date()).format("X");
                }
            })
            req.body.family_details.forEach((item) => {
                item.created_by = req.user.user_id;
                if (!item.created_on) {
                    item.created_on = moment(new Date()).format("X");
                }
            })
            req.body.nominee_details.forEach((item) => {
                item.created_by = req.user.user_id;
                if (!item.created_on) {
                    item.created_on = moment(new Date()).format("X");
                }
            })
            transaction = await sequelize.sequelize.transaction();

            // get unit id_number
            var unitIdNumberResult = await api.findOneAsync(sequelize, "Unit", { where: { 'id': req.body.basic_details.unit_id } });
            // get area id_number
            var areaIdNumberResult = await api.findOneAsync(sequelize, "Area", { where: { 'id': req.body.basic_details.area_id } });

            // Creating member id
            var lastMemberResult = await api.findOneAsync(sequelize, "Member", { order: [['id', 'DESC']] });
            var newRegNo = '';
            if (lastMemberResult && lastMemberResult.register_number) {
                let splittedArr = lastMemberResult.register_number.slice(8);
                let next = parseInt(splittedArr, 10);
                next = next + 1;
                newRegNo = areaIdNumberResult.id_number + '/' + unitIdNumberResult.id_number + '/' + this.appendzero(next);
            } else { //First entry in the table
                newRegNo = areaIdNumberResult.id_number + '/' + unitIdNumberResult.id_number + '/' + '00001'
            }
            req.body.basic_details.register_number = newRegNo;
            // inserting user permission }
            var memberResult = await api.createT(sequelize, "Member", req.body.basic_details, transaction);
            if (!memberResult) {
                transaction.rollback();
                return res.json({ "status": 'error', "message": "something went wrong" });
            }
            console.log("member Id", memberResult.id)
            req.body.business_details.forEach((item) => {
                item.member_id = memberResult.id;
            })
            req.body.family_details.forEach((item) => {
                item.member_id = memberResult.id;
            })
            req.body.nominee_details.forEach((item) => {
                item.member_id = memberResult.id;
            })
            var businessPromise = api.bulkCreateT(sequelize, "Business", req.body.business_details, transaction);
            var familyPromise = api.bulkCreateT(sequelize, "Family", req.body.family_details, transaction);
            var nomineePromise = api.bulkCreateT(sequelize, "Nominee", req.body.nominee_details, transaction);
            let [businessResult, familyResult, nomineeResult] = await Promise.all([businessPromise, familyPromise, nomineePromise]);
            var result = {
                'Member': memberResult,
                'Business': businessResult,
                'Family': familyResult,
                'Nominee': nomineeResult
            }
            await transaction.commit();

            // registration fee collected from member 
            var registrationFeeResult = await api.findOneAsync(sequelize, "RegistrationFee", {
                where: { deleted: '0' },
            });
            var registrationFeeId = 1;
            /// inserting registration fee to registrationfeecollected table
            var collected_data = {
                'member_id': memberResult.id,
                'registration_fee_id': registrationFeeResult != null ? registrationFeeResult.id : registrationFeeId,
                'created_by': req.user.user_id,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            var collectedResult = await api.createAsync(sequelize, "RegistrationFeeCollected", collected_data);

            var msg = 'Hi ' + memberResult.first_name + ', you are successfully enrolled into Vypari Vyavasayi ekopana samithi'
            var smsResult = await sms.sendSMS(memberResult.mobile, msg)
            result.registrationFee = registrationFeeResult;
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            // transaction.rollback();
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
        var limit = req.body.limit ? req.body.limit : 10000
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
            } else if (utils.isNotUndefined(req.body.from_dob) && utils.isNotUndefined(req.body.to_dob) && req.body.from_dob == req.body.to_dob) {
                member_condition.date_of_birth = req.body.from_dob;
            }
            if (utils.isNotUndefined(req.body.plus_member)) {
                member_condition.plus_member = req.body.plus_member;
            }
            if (utils.isNotUndefined(req.body.division_id)) {
                member_condition.division_id = req.body.division_id;
            }
            if (utils.isNotUndefined(req.body.unit_id)) {
                member_condition.unit_id = req.body.unit_id;
            }
            if (utils.isNotUndefined(req.body.area_id)) {
                member_condition.area_id = req.body.area_id;
            }
            if (utils.isNotUndefined(req.body.id)) {
                member_condition.id = req.body.id;
            }
            /// if memberId is present then dead condition is not taken
            else if (utils.isNotUndefined(req.body.dead)) {
                member_condition.dead = req.body.dead == 0 ? 0 : 1;
            } else {
                member_condition.dead = 0;
            }
            if (utils.isNotUndefined(req.body.migrated)) {
                member_condition.migrated = req.body.migrated;
            }
            if (utils.isNotUndefined(req.body.created_by)) {
                member_condition.created_by = req.body.created_by;
            }
            var include = [{ model: sequelize.models.Business, as: "Business" },
            { model: sequelize.models.Family, as: "Family" },
            { model: sequelize.models.Nominee, as: "Nominee" },
            { model: sequelize.models.Area, as: "Area", attributes: ['id', 'name', 'id_number'] },
            { model: sequelize.models.Unit, as: "Unit", attributes: ['id', 'name', 'id_number'] },
            { model: sequelize.models.Death, as: "Death", attributes: ['datetime', 'details', 'venue', 'last_date', 'created_on'] },
            { model: sequelize.models.RegistrationFeeCollected, as: "RegistrationFeeCollected", attributes: ['id'], include: [{ model: sequelize.models.RegistrationFee, as: "RegistrationFee", attributes: ['id', 'amount'] }] }];
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
    async updateMember(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.member_id)) {
                return res.json({ "status": "error", "message": "Member id is required!" });
            }
            var member_result = {};
            var member_error = '';
            var isMemberUpdate = false;
            var isBusinessUpdate = false;
            var isFamilyUpdate = false;
            var isNomineeUpdate = false;
            if (req.body.basic_details && Object.keys(req.body.basic_details).length > 0) {
                let member_data = {}
                if (utils.isNotUndefined(req.body.basic_details.first_name)) member_data.first_name = req.body.basic_details.first_name;
                if (utils.isNotUndefined(req.body.basic_details.middle_name)) member_data.middle_name = req.body.basic_details.middle_name;
                if (utils.isNotUndefined(req.body.basic_details.last_name)) member_data.last_name = req.body.basic_details.last_name;
                if (utils.isNotUndefined(req.body.basic_details.address)) member_data.address = req.body.basic_details.address;
                if (utils.isNotUndefined(req.body.basic_details.mobile)) member_data.mobile = req.body.basic_details.mobile;
                if (utils.isNotUndefined(req.body.basic_details.date_of_birth)) member_data.date_of_birth = req.body.basic_details.date_of_birth;
                if (utils.isNotUndefined(req.body.basic_details.aadhar)) member_data.aadhar = req.body.basic_details.aadhar;
                if (utils.isNotUndefined(req.body.basic_details.area_id)) member_data.area_id = req.body.basic_details.area_id;
                if (utils.isNotUndefined(req.body.basic_details.unit_id)) member_data.unit_id = req.body.basic_details.unit_id;
                if (utils.isNotUndefined(req.body.basic_details.unit_id)) member_data.unit_id = req.body.basic_details.unit_id;
                if (utils.isNotUndefined(req.body.basic_details.designation)) member_data.designation = req.body.basic_details.designation;
                if (utils.isNotUndefined(req.body.basic_details.photo)) member_data.photo = req.body.basic_details.photo;
                if (utils.isNotUndefined(req.body.basic_details.form_photo)) member_data.form_photo = req.body.basic_details.form_photo;
                if (utils.isNotUndefined(req.body.basic_details.migrated)) member_data.migrated = req.body.basic_details.migrated;
                if (utils.isNotUndefined(req.body.plus_member)) {
                    member_data.plus_member = req.body.plus_member;
                }
                member_data.modified_on = moment(new Date()).format("X");
                member_data.modified_by = req.user.user_id;
                let condition = { where: { 'id': req.body.member_id } };
                // updating member
                try {
                    member_result = await api.updateAsync(sequelize, 'Member', member_data, condition)
                }
                catch (error) {
                    member_error = error;
                }
                isMemberUpdate = true;
            }
            var business_result = [];
            if (req.body.business_details && Array.isArray(req.body.business_details) && req.body.business_details.length > 0) {
                // delete all business details with the memberId
                let memberID = req.body.member_id;
                await api.delete(sequelize, 'Business', 'member_id', memberID, async (status, data, message) => {

                    // insert or create new business
                    await req.body.business_details.forEach(async (businessItem) => {

                        try {
                            businessItem.member_id = req.body.member_id;
                            businessItem.created_by = req.user.user_id;
                            businessItem.created_on = req.body.created_on ? req.body.created_on : moment(new Date()).format("X");

                            let result = await api.createAsync(sequelize, 'Business', businessItem);
                            business_result.push({ "status": 'success', "data": result });
                        }
                        catch (error) {
                            business_result.push({ "status": 'error', "message": sequelize.getErrors(error) });
                        }
                    });
                });
                isBusinessUpdate = true;
            }
            var family_result = [];
            if (req.body.family_details && Array.isArray(req.body.family_details) && req.body.family_details.length > 0) {
                let memberID = req.body.member_id;
                await api.delete(sequelize, 'Family', 'member_id', memberID, async (status, data, message) => {
                    // insert or create new family
                    await req.body.family_details.forEach(async (familyItem) => {
                        try {
                            familyItem.member_id = req.body.member_id;
                            familyItem.created_by = req.user.user_id;
                            familyItem.created_on = req.body.created_on ? req.body.created_on : moment(new Date()).format("X");

                            let result = await api.createAsync(sequelize, 'Family', familyItem)
                            family_result.push({ "status": 'success', "data": result });
                        }
                        catch (error) {
                            family_result.push({ "status": 'error', "message": sequelize.getErrors(error) });
                        }
                    });
                });
                isFamilyUpdate = true;
            }
            var nominee_result = {};
            var nominee_error = '';

            if (req.body.nominee_details && Array.isArray(req.body.nominee_details) && req.body.nominee_details.length > 0) {
                let memberID = req.body.member_id;
                await api.delete(sequelize, 'Nominee', 'member_id', memberID, async (status, data, message) => {
                    // insert or create new family
                    await req.body.nominee_details.forEach(async (nomineeItem) => {
                        try {
                            nomineeItem.member_id = req.body.member_id;
                            nomineeItem.created_by = req.user.user_id;
                            nomineeItem.created_on = req.body.created_on ? req.body.created_on : moment(new Date()).format("X");
                            nominee_result = await api.createAsync(sequelize, 'Nominee', nomineeItem);
                        }
                        catch (error) {
                            nominee_result = error;
                            console.log("NOMINEE ERROR >>>> ", error);
                        }
                    });
                });

                isNomineeUpdate = true;
            }
            var result = {}
            if (isMemberUpdate == true) {
                result['Member'] = member_error != '' ? { "status": 'error', "message": member_error } : { "status": 'success', "data": member_result };
            }
            if (isBusinessUpdate == true) {
                result['Business'] = business_result.length != 0 ? business_result : [];
            }
            if (isFamilyUpdate == true) {
                result['Family'] = family_result != 0 ? family_result : [];
            }
            if (isNomineeUpdate == true) {
                result['Nominee'] = nominee_error != '' ? { "status": 'error', "message": nominee_error } : { "status": 'success', "data": nominee_result };
            }

            /// update member registration number
            await this.updateMemberRegistrationId(sequelize, req.body.member_id);

            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Member update Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    async deleteMember(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.member_id)) {
                return res.json({ "status": "error", "message": "Member id is required!" });
            }
            var condition = { where: { 'id': req.body.member_id } };
            const member_data = {}
            member_data.deleted = 1;
            member_data.modified_on = moment(new Date()).format("X");
            member_data.modified_by = req.user.user_id;

            // deleteing member by setting deleted to 1
            api.updateCustom(sequelize, 'Member', member_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data })
                }
            });
        }
        catch (err) {
            logger.error("Member delete Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    async changeMemberId(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            const Op = sequelize.Sequelize.Op
            const fn = sequelize.Sequelize.fn
            var offset = req.body.start ? req.body.start : 0
            var limit = req.body.limit ? req.body.limit : 10000
            var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
            var member_condition = {}

            var json_obj = {};
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            var result = await api.findAllAsync(sequelize, "Member", json_obj);


            for (let index = 0; index < result.length; ++index) {
                if (result[index].register_number.length < 11) {

                    this.updateMemberRegistrationId(sequelize, result[index].id);
                    // // get unit id_number
                    // var unitIdNumberResult = await api.findOneAsync(sequelize, "Unit", { where: { 'id': result[index].unit_id } });
                    // // get area id_number
                    // var areaIdNumberResult = await api.findOneAsync(sequelize, "Area", { where: { 'id': result[index].area_id } });

                    // var condition = { where: { 'id': result[index].id } };

                    // var oldReg = result[index].register_number;
                    // var number = oldReg.substring(6);
                    // var newReg = areaIdNumberResult.id_number + '/' + unitIdNumberResult.id_number + '/' + this.appendzero(number);

                    // const member_data = {}
                    // member_data.register_number = newReg;

                    // api.updateCustom(sequelize, 'Member', member_data, condition, function (status, data, message) {
                    //     console.log("result ", result[index].id);
                    // });
                }
            }
            var newresult = await api.findAllAsync(sequelize, "Member", json_obj);
            return res.json({ "status": 'success', "data": await newresult });
        }
        catch (err) {
            logger.error("member register id Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    /// update member registration number 
    async updateMemberRegistrationId(sequelize, memberId) {
        if (utils.isNotUndefined(memberId)) {
            let condition = { where: { 'id': memberId } };

            var result = await api.findOneAsync(sequelize, "Member", condition);

            // get unit id_number
            var unitIdNumberResult = await api.findOneAsync(sequelize, "Unit", { where: { 'id': result.unit_id } });
            // get area id_number
            var areaIdNumberResult = await api.findOneAsync(sequelize, "Area", { where: { 'id': result.area_id } });

            var oldReg = result.register_number;
            var number = oldReg.substring(8);
            var newReg = areaIdNumberResult.id_number + '/' + unitIdNumberResult.id_number + '/' + this.appendzero(number);

            const member_data = {}
            member_data.register_number = newReg;

            await api.updateCustom(sequelize, 'Member', member_data, condition, function (status, data, message) {
                console.log("Registration number ", memberId);
            });
        }
    }


    /// member_registraion id need to uppend some extra zeros
    appendzero(num) {

        switch (num.toString().length) {
            case 1:
                return '0000' + num;
            case 2:
                return '000' + num;
            case 3:
                return '00' + num;
            case 4:
                return '0' + num;
            case 5:
                return num;
        }
    }
}


module.exports = new Member()


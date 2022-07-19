"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
// var path_services = path.normalize(__dirname + "/services")

var api = require(path_controller + '/api')
var sms = require('./sendsms')


class CroneJob {

    constructor() { }

    async sendSmsBasedOnArea(app) {
        try {
            const sequelize = app.get('sequelize')


            var memberIdArray = [];
            /// fetch all uncompleted areaId in send_area_sms table
            var sendAreaSmsCondition = {};
            sendAreaSmsCondition = { where: { completed: 0 }, attributes: ['area_id'] };
            var uncompletedAreaIds = await api.findAllAsync(sequelize, "SendAreaSms", sendAreaSmsCondition);

            /// fetch all memberId from sms_log table 
            var smsLogCondition = {};
            smsLogCondition = { attributes: ['member_id'] };
            var smsLogMemberIds = await api.findAllAsync(sequelize, "SmsLog", smsLogCondition);

            var smsLogMemberIdArray = [];
            smsLogMemberIds.forEach((memberId) => {
                smsLogMemberIdArray.push(memberId['member_id']);
            });


            /// fetch all memberId under  areaId
            for (var i = 0; i < uncompletedAreaIds.length; i++) {
                let smsLogMemberIdsTemp = smsLogMemberIdArray;
                var memberIdCondition = {};
                memberIdCondition = { where: { dead: 0, active: 1, area_id: uncompletedAreaIds[i]['area_id'] }, attributes: ['id'] };
                var result = await api.findAllAsync(sequelize, "Member", memberIdCondition);

                var memberIds = [];

                result.forEach((mId) => {
                    memberIds.push(mId['id']);
                });

                if (!utils.isNotUndefined(smsLogMemberIdsTemp) || smsLogMemberIdsTemp == 0) {
                    memberIdArray.push(memberIds);
                }
                else {
                    memberIdArray.push(memberIds.filter(x => !smsLogMemberIdsTemp.includes(x)));
                }

                /// update sendAreaSms table set completed = 1
                let send_area_sms_data = {}
                send_area_sms_data.completed = 1;
                send_area_sms_data.modified_on = moment(new Date()).format("X");
                send_area_sms_data.modified_by = 0;
                let send_area_sms_condition = { where: { 'area_id': uncompletedAreaIds[i]['area_id'] } };

                await api.updateAsync(sequelize, 'SendAreaSms', send_area_sms_data, send_area_sms_condition)

            }

            /// sms to be send to all member inside memberIdArray
            /// fetch member mobile and registartion_number
            if (utils.isNotUndefined(memberIdArray[0])) {
                for (var i = 0; i < memberIdArray[0].length; i++) {
                    var memberCondition = { where: { dead: 0, active: 1, id: memberIdArray[0][i] }, attributes: ['id', 'register_number', 'mobile'] };
                    var memberResult = await api.findOneAsync(sequelize, "Member", memberCondition);

                    /// send sms
                    var sms_result = await sms.areaSms(memberResult.mobile, memberResult.register_number);

                    /// set the smsLog by creating an entry 
                    var sms_log_data = {
                        'member_id': memberResult['id'],
                        'response': sms_result['data'].toString(),
                        'send': sms_result['data'].toString().includes('Enter valid MobileNo') ? 0 : 1,
                        'created_by': 0,
                        'created_on': moment(new Date()).format("X")
                    }
                    var smsLogResult = await api.createAsync(sequelize, "SmsLog", sms_log_data);
                }

            }
            // return res.json({ "status": "success", "message": memberResult })


        }
        catch (err) {
            console.error("sendSmsBasedOnArea Exception :---->")
            console.error(err)
            throw err;
            // return res.json({ "status": 'error', "message": err })
        }
    }
}

module.exports = new CroneJob()

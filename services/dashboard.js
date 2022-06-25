"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
class Dashboard {

    constructor() { }

    async dashboardCount(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op

        try {
            var memberActive = 0;
            var memberDead = 0;

            var today = new Date();
            var date = new Date(today.getFullYear() - 65, today.getMonth(), today.getDate());
            var date65 = moment(date).format("X");

            var plus_condition = { [Op.or]: [{ date_of_birth: { [Op.lt]: date65 } }] };
            plus_condition.dead = 0;
            var plus_member = { where: plus_condition };

            api.findCount(sequelize, "Member", plus_member, (status, data, message) => {
                var dashboardResult = { "plus_member": data }


                var json_obj = { where: { 'dead': 0 } };
                api.findCount(sequelize, "Member", json_obj, function (status, data, message) {
                    memberActive = data;
                    dashboardResult.active_member = memberActive;
                    json_obj = { where: { 'dead': 1 } };

                    api.findCount(sequelize, "Member", json_obj, async (status, data, message) => {
                        memberDead = data;
                        dashboardResult.dead_member = memberDead;

                        const amountCollected = await sequelize.sequelize.query("SELECT sum(ca.amount) as collected_amount FROM collection c JOIN collection_amount ca ON ca.id = c.amount_id WHERE paid = 1;");
                        dashboardResult['amount_collected'] = amountCollected;
                        
                        const regAmount = await sequelize.sequelize.query("SELECT sum(rf.amount) as registration_amount FROM registration_fee rf JOIN registration_fee_collected rfc ON rfc.registration_fee_id = rf.id;");
                        dashboardResult['reg_collected'] = regAmount;

                        return res.json({ "status": 'success', "data": dashboardResult });


                    });
                });
            });

        }
        catch (err) {
            logger.error("DashboardCount Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }
}
module.exports = new Dashboard()

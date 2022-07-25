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

            var plus_condition = { plus_member: 1 };
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
                        dashboardResult['amount_collected'] = amountCollected[0][0]['collected_amount'];

                        const regAmountList = await sequelize.sequelize.query("SELECT COUNT(registration_fee_id) AS count, registration_fee_id from `registration_fee_collected` GROUP BY registration_fee_id;");
                        var reg_collected = 0;
                        for (var i = 0; i < regAmountList[0].length; i++) {
                            const regAmounts = await sequelize.sequelize.query(`SELECT sum(amount) as amount FROM registration_fee  where id =${regAmountList[0][i].registration_fee_id} GROUP BY amount;`);
                            if (utils.isNotUndefined(regAmounts[0][0]['amount'])) {
                                reg_collected = reg_collected + parseInt(regAmounts[0][0]['amount']);
                            }
                        }
                        dashboardResult['reg_collected'] = reg_collected;


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

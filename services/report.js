"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
var async = require('async');
class Report {

    constructor() {

    }
    async deathReport(req, res) {
        var logger = req.app.get('logger')
        const mysql = req.app.get('mysql')
        try {
            var month_query = `SELECT
                            DATE_FORMAT(FROM_UNIXTIME(datetime), '%M') month,
                            DATE_FORMAT(FROM_UNIXTIME(datetime), '%Y') year,
                            COUNT(MONTH(FROM_UNIXTIME(datetime))) dead,
                            COUNT(
                                DATE_FORMAT(
                                    FROM_DAYS(DATEDIFF(FROM_UNIXTIME(datetime), FROM_UNIXTIME(m.date_of_birth))),
                                    '%Y'
                                ) > 65
                            ) as above65,
                            COUNT(
                                DATE_FORMAT(
                                    FROM_DAYS(DATEDIFF(FROM_UNIXTIME(datetime), FROM_UNIXTIME(m.date_of_birth))),
                                    '%Y'
                                ) < 30
                            ) as below30
                        FROM
                            death d
                            left join member m on d.member_id = m.id`;
            if (req.body.year) {
                month_query += ` WHERE YEAR(FROM_UNIXTIME(d.datetime)) = ${req.body.year}`;
            }
            month_query += ` GROUP BY YEAR(FROM_UNIXTIME(datetime)),
                                                MONTH(FROM_UNIXTIME(datetime));`;
            var year_query = `SELECT
                                DATE_FORMAT(FROM_UNIXTIME(datetime), '%Y') year,
                                COUNT(YEAR(FROM_UNIXTIME(datetime))) dead,
                                COUNT(
                                    DATE_FORMAT(
                                        FROM_DAYS(DATEDIFF(FROM_UNIXTIME(datetime), FROM_UNIXTIME(m.date_of_birth))),
                                        '%Y'
                                    ) > 65
                                ) as above65,
                                COUNT(
                                    DATE_FORMAT(
                                        FROM_DAYS(DATEDIFF(FROM_UNIXTIME(datetime), FROM_UNIXTIME(m.date_of_birth))),
                                        '%Y'
                                    ) < 30
                                ) as below30
                            FROM
                                death d
                                left join member m on d.member_id = m.id`;
            if (req.body.year) {
                year_query += ` WHERE YEAR(FROM_UNIXTIME(d.datetime)) = ${req.body.year}`;
            }
            year_query += ` GROUP BY YEAR(FROM_UNIXTIME(datetime));`;
            async.parallel([
                function (callback) {
                    mysql.query(month_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }

                    })
                }
                , function (callback) {
                    mysql.query(year_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }

                    })
                }
            ], function (err, results) {
                if (err) {
                    logger.error("Death Report Exception :---->")
                    logger.error(err)
                    return res.json({ "status": 'error', "message": 'Something broken!' });
                }
                // final callback
                var yearResult = results[1];
                var monthResult = results[0];
                yearResult.forEach(yearItem => {
                    yearItem["months"] = []
                    monthResult.forEach(monthItem => {
                        if (yearItem.year == monthItem.year) {
                            delete monthItem.year;
                            yearItem["months"].push(monthItem)
                        }
                    })
                });
                return res.json({ "status": 'success', "data": yearResult });
            });


        }
        catch (err) {
            logger.error("Death Report Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": 'Something broken!' })
        }
    }

    //collection report
    async collectionReport(req, res) {
        var logger = req.app.get('logger')
        const mysql = req.app.get('mysql')
        try {
            var month_query = `SELECT
                                    DATE_FORMAT(FROM_UNIXTIME(c.created_on), '%M') month,
                                    DATE_FORMAT(FROM_UNIXTIME(c.created_on), '%Y') year,
                                    SUM(if(c.paid = 1,ca.amount,0)) collected,
                                    SUM(if(c.paid = 0,ca.amount,0)) pending,
                                    SUM(ca.amount) total
                                FROM
                                    collection c
                                    left join collection_amount ca on c.amount_id = ca.id`;
            if (req.body.year) {
                month_query += ` WHERE YEAR(FROM_UNIXTIME(c.created_on)) = ${req.body.year}`;
            }
            month_query += ` GROUP BY YEAR(FROM_UNIXTIME(c.created_on)),
                                                MONTH(FROM_UNIXTIME(c.created_on));`;
            var year_query = `SELECT
                                DATE_FORMAT(FROM_UNIXTIME(c.created_on), '%Y') year,
                                SUM(if(c.paid = 1,ca.amount,0)) collected,
                                SUM(if(c.paid = 0,ca.amount,0)) pending,
                                SUM(ca.amount) total
                            FROM
                                collection c
                                left join collection_amount ca on c.amount_id = ca.id`;
            if (req.body.year) {
                year_query += ` WHERE YEAR(FROM_UNIXTIME(c.created_on)) = ${req.body.year}`;
            }
            year_query += ` GROUP BY YEAR(FROM_UNIXTIME(c.created_on));`;
            async.parallel([
                function (callback) {
                    mysql.query(month_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }

                    })
                }
                , function (callback) {
                    mysql.query(year_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }

                    })
                }
            ], function (err, results) {
                if (err) {
                    logger.error("Death Report Exception :---->")
                    logger.error(err)
                    return res.json({ "status": 'error', "message": 'Something broken!' });
                }
                // final callback
                var yearResult = results[1];
                var monthResult = results[0];
                yearResult.forEach(yearItem => {
                    yearItem["months"] = []
                    monthResult.forEach(monthItem => {
                        if (yearItem.year == monthItem.year) {
                            delete monthItem.year;
                            yearItem["months"].push(monthItem)
                        }
                    })
                });
                return res.json({ "status": 'success', "data": yearResult });
            });


        }
        catch (err) {
            logger.error("Collection Report Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": 'Something broken!' })
        }
    }

    async memberPayoutReport(req, res) {
        var logger = req.app.get('logger')
        const mysql = req.app.get('mysql')
        try {
            var month_query = `SELECT
                                    DATE_FORMAT(FROM_UNIXTIME(mp.payout_date), '%M') month,
                                    DATE_FORMAT(FROM_UNIXTIME(mp.payout_date), '%Y') year,
                                    SUM(mp.given) payout_total,
                                    COUNT(m.id) member_count
                                FROM
                                    member_payout mp
                                    left join member m on mp.member_id = m.id`;
            var where_array = []
            if (req.body.area_id) {
                where_array.push(`m.area_id = ${req.body.area_id}`);
            }
            if (req.body.unit_id) {
                where_array.push(`m.unit_id = ${req.body.unit_id}`);
            }
            if (where_array.length > 0) {
                month_query += ` WHERE ` + where_array.join(" AND ")
            }
            month_query += ` GROUP BY YEAR(FROM_UNIXTIME(mp.payout_date)),
                                                MONTH(FROM_UNIXTIME(mp.payout_date));`;
            var year_query = `SELECT
                                DATE_FORMAT(FROM_UNIXTIME(mp.payout_date), '%Y') year,
                                SUM(mp.given) payout_total,
                                COUNT(m.id) member_count
                            FROM
                                member_payout mp
                                left join member m on mp.member_id = m.id`;
            var where_array = []
            if (req.body.area_id) {
                where_array.push(`m.area_id = ${req.body.area_id}`);
            }
            if (req.body.unit_id) {
                where_array.push(`m.unit_id = ${req.body.unit_id}`);
            }
            if (where_array.length > 0) {
                year_query += ` WHERE ` + where_array.join(" AND ")
            }
            year_query += ` GROUP BY YEAR(FROM_UNIXTIME(mp.payout_date))`;
            async.parallel([
                function (callback) {
                    mysql.query(month_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }

                    })
                }
                , function (callback) {
                    mysql.query(year_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }

                    })
                }
            ], function (err, results) {
                if (err) {
                    logger.error("member payout Report Exception :---->")
                    logger.error(err)
                    return res.json({ "status": 'error', "message": 'Something broken!' });
                }
                // final callback
                var yearResult = results[1];
                var monthResult = results[0];
                yearResult.forEach(yearItem => {
                    yearItem["months"] = []
                    monthResult.forEach(monthItem => {
                        if (yearItem.year == monthItem.year) {
                            delete monthItem.year;
                            yearItem["months"].push(monthItem)
                        }
                    })
                });
                return res.json({ "status": 'success', "data": yearResult });
            });


        }
        catch (err) {
            logger.error("Member Payout Report Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": 'Something broken!' })
        }
    }

    async areaPayoutReport(req, res) {
        var logger = req.app.get('logger')
        const mysql = req.app.get('mysql')
        try {
            var month_query = `SELECT
                                    DATE_FORMAT(FROM_UNIXTIME(created_on), '%M') month,
                                    DATE_FORMAT(FROM_UNIXTIME(created_on), '%Y') year,
                                    SUM(amount) payout_total
                                FROM
                                    area_payout
                                GROUP BY
                                    YEAR(FROM_UNIXTIME(created_on)),
                                    MONTH(FROM_UNIXTIME(created_on));`;
            var year_query = `SELECT
                                    DATE_FORMAT(FROM_UNIXTIME(created_on), '%Y') year,
                                    SUM(amount) payout_total
                                FROM
                                    area_payout
                                GROUP BY
                                    YEAR(FROM_UNIXTIME(created_on))`;
            async.parallel([
                function (callback) {
                    mysql.query(month_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }

                    })
                }
                , function (callback) {
                    mysql.query(year_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }

                    })
                }
            ], function (err, results) {
                if (err) {
                    logger.error("area payout Report Exception :---->")
                    logger.error(err)
                    return res.json({ "status": 'error', "message": 'Something broken!' });
                }
                // final callback
                var yearResult = results[1];
                var monthResult = results[0];
                yearResult.forEach(yearItem => {
                    yearItem["months"] = []
                    monthResult.forEach(monthItem => {
                        if (yearItem.year == monthItem.year) {
                            delete monthItem.year;
                            yearItem["months"].push(monthItem)
                        }
                    })
                });
                return res.json({ "status": 'success', "data": yearResult });
            });


        }
        catch (err) {
            logger.error("Area Payout Report Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": 'Something broken!' })
        }
    }

    async unitPayoutReport(req, res) {
        var logger = req.app.get('logger')
        const mysql = req.app.get('mysql')
        try {
            var month_query = `SELECT
                                    DATE_FORMAT(FROM_UNIXTIME(created_on), '%M') month,
                                    DATE_FORMAT(FROM_UNIXTIME(created_on), '%Y') year,
                                    SUM(amount) payout_total
                                FROM
                                    unit_payout
                                GROUP BY
                                    YEAR(FROM_UNIXTIME(created_on)),
                                    MONTH(FROM_UNIXTIME(created_on));`;
            var year_query = `SELECT
                                    DATE_FORMAT(FROM_UNIXTIME(created_on), '%Y') year,
                                    SUM(amount) payout_total
                                FROM
                                    unit_payout
                                GROUP BY
                                    YEAR(FROM_UNIXTIME(created_on))`;
            async.parallel([
                function (callback) {
                    mysql.query(month_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }

                    })
                }
                , function (callback) {
                    mysql.query(year_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }

                    })
                }
            ], function (err, results) {
                if (err) {
                    logger.error("unit payout Report Exception :---->")
                    logger.error(err)
                    return res.json({ "status": 'error', "message": 'Something broken!' });
                }
                // final callback
                var yearResult = results[1];
                var monthResult = results[0];
                yearResult.forEach(yearItem => {
                    yearItem["months"] = []
                    monthResult.forEach(monthItem => {
                        if (yearItem.year == monthItem.year) {
                            delete monthItem.year;
                            yearItem["months"].push(monthItem)
                        }
                    })
                });
                return res.json({ "status": 'success', "data": yearResult });
            });


        }
        catch (err) {
            logger.error("Unit Payout Report Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": 'Something broken!' })
        }
    }

    async districtPayoutReport(req, res) {
        var logger = req.app.get('logger')
        const mysql = req.app.get('mysql')
        try {
            var month_query = `SELECT
                                    DATE_FORMAT(FROM_UNIXTIME(created_on), '%M') month,
                                    DATE_FORMAT(FROM_UNIXTIME(created_on), '%Y') year,
                                    SUM(amount) payout_total
                                FROM
                                    district_payout
                                GROUP BY
                                    YEAR(FROM_UNIXTIME(created_on)),
                                    MONTH(FROM_UNIXTIME(created_on));`;
            var year_query = `SELECT
                                    DATE_FORMAT(FROM_UNIXTIME(created_on), '%Y') year,
                                    SUM(amount) payout_total
                                FROM
                                    district_payout
                                GROUP BY
                                    YEAR(FROM_UNIXTIME(created_on))`;
            async.parallel([
                function (callback) {
                    mysql.query(month_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }

                    })
                }
                , function (callback) {
                    mysql.query(year_query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }

                    })
                }
            ], function (err, results) {
                if (err) {
                    logger.error("district payout Report Exception :---->")
                    logger.error(err)
                    return res.json({ "status": 'error', "message": 'Something broken!' });
                }
                // final callback
                var yearResult = results[1];
                var monthResult = results[0];
                yearResult.forEach(yearItem => {
                    yearItem["months"] = []
                    monthResult.forEach(monthItem => {
                        if (yearItem.year == monthItem.year) {
                            delete monthItem.year;
                            yearItem["months"].push(monthItem)
                        }
                    })
                });
                return res.json({ "status": 'success', "data": yearResult });
            });


        }
        catch (err) {
            logger.error("District Payout Report Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": 'Something broken!' })
        }
    }

    async dataEntryReport(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        const fn = sequelize.Sequelize.fn
        var user_condition = {}
        const mysql = req.app.get('mysql')

        try {
            var query = `SELECT user.id, user.first_name, user.middle_name, user.last_name, user.email, user.mobile, user.type, user.blocked, user.deleted,  COUNT(Member.register_number) AS total_count FROM user AS user LEFT OUTER JOIN member AS Member ON user.id = Member.created_by GROUP BY user.id;`;

            async.parallel([
                function (callback) {
                    mysql.query(query, (error, data) => {
                        if (error) {
                            callback(error, null)
                        } else {
                            callback(null, data)
                        }

                    })
                },
            ], function (err, results) {
                if (err) {
                    logger.error("district payout Report Exception :---->")
                    logger.error(err)
                    return res.json({ "status": 'error', "message": 'Something broken!' });
                }
                var result = results[0];

                return res.json({ "status": 'success', "data": result });
            });


            // var exclude = ['id','created_on', 'modified_on', 'deleted']

            // var include = {
            //     model: sequelize.models.Member, as: "Member",
            //     attributes: [[fn('COUNT', sequelize.Sequelize.col('Member.register_number')), 'count']],
            //     exclude: exclude
            // };

            // var json_obj = {
            //    include: include,
            //     attributes: [['id', 'uid'], 'first_name', 'middle_name', 'last_name', 'email', 'mobile', 'type', 'blocked', 'deleted'],
            //     group: ['user.created_on']
            // }

            // var result = await api.findAllAsync(sequelize, "User", json_obj);
            // return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("User List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }

    }

    /// report of members. will return number of member in area and unit
    async memberReport(req, res) {
        var sequelize = req.app.get('sequelize')
        const Op = sequelize.Sequelize.Op

        var member_condition = {}
        try {
            if (utils.isNotUndefined(req.body.area_id)) {
                member_condition.area_id = req.body.area_id;
            }

            var condition = { where: { area_id: 1 } };
            var areaResult = await api.findAllAsync(sequelize, "Unit", condition);

            /// area plus memeber
            var member_condition = { where: { plus_member: 1, area_id: 1 } };
            var reportResult = {};
            reportResult.plus_member = await api.findCountAsync(sequelize, "Member", member_condition);

            /// area migrated total 
            member_condition = { where: { migrated: 1, area_id: 1 } };
            reportResult.migrated_member = await api.findCountAsync(sequelize, "Member", member_condition);

            /// area active total
            member_condition = { where: { active: 1, dead: 0, area_id: 1 } };
            reportResult.active_member = await api.findCountAsync(sequelize, "Member", member_condition);

            /// area dead total
            member_condition = { where: { dead: 1, area_id: 1 } };
            reportResult.total_dead_member = await api.findCountAsync(sequelize, "Member", member_condition);

            /// area normal dead member
            member_condition = { where: { dead: 1, plus_member: 0, area_id: 1 } };
            reportResult.normal_dead_member = await api.findCountAsync(sequelize, "Member", member_condition);

            /// area plus dead member
            member_condition = { where: { dead: 1, plus_member: 1, area_id: 1 } };
            reportResult.plus_dead_member = await api.findCountAsync(sequelize, "Member", member_condition);

            /// area all total 
            member_condition = { where: { area_id: 1, } };
            reportResult.total = await api.findCountAsync(sequelize, "Member", unit_condition);

            var area_count_result = [];

            for (var i = 0; i < areaResult.length; i++) {
                let unitResult = {};

                unitResult.id = areaResult[i].id;
                unitResult.name = areaResult[i].name;
                unitResult.id_number = areaResult[i].id_number;

                /// area active total 
                unit_condition = { where: { active: 1, dead: 0, area_id: 1, unit_id: areaResult[i].id } };
                unitResult.active_member = await api.findCountAsync(sequelize, "Member", unit_condition);

                /// unit plus memeber
                var unit_condition = { where: { plus_member: 1, area_id: 1, unit_id: areaResult[i].id } };
                unitResult.plus_member = await api.findCountAsync(sequelize, "Member", unit_condition);

                /// unit migrated total 
                unit_condition = { where: { migrated: 1, area_id: 1, unit_id: areaResult[i].id } };
                unitResult.migrated_member = await api.findCountAsync(sequelize, "Member", unit_condition);

                /// unit dead total 
                unit_condition = { where: { dead: 1, area_id: 1, unit_id: areaResult[i].id } };
                unitResult.total_dead_member = await api.findCountAsync(sequelize, "Member", unit_condition);

                /// unit normal dead member 
                unit_condition = { where: { dead: 1, plus_member: 0, area_id: 1, unit_id: areaResult[i].id } };
                unitResult.normal_dead_member = await api.findCountAsync(sequelize, "Member", unit_condition);

                /// unit plus dead total 
                unit_condition = { where: { dead: 1, plus_member: 1, area_id: 1, unit_id: areaResult[i].id } };
                unitResult.plus_dead_member = await api.findCountAsync(sequelize, "Member", unit_condition);

                /// unit all total 
                unit_condition = { where: { area_id: 1, unit_id: areaResult[i].id } };
                unitResult.total = await api.findCountAsync(sequelize, "Member", unit_condition);


                area_count_result.push(unitResult);
                reportResult.Area = area_count_result;
            }
            reportResult.Area = area_count_result;
            return res.json({ "status": 'success', "data": reportResult });
        }
        catch (err) {
            console.error("memberReport Exception :---->")
            console.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

}

module.exports = new Report()


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
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const mysql = req.app.get('mysql')
        try {
            if (!utils.isNotUndefined(req.body.year)) {
                return res.json({ "status": "error", "message": "Year is required!" });
            }
            var month_query = `SELECT
                            DATE_FORMAT(FROM_UNIXTIME(datetime), '%M') month,
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
                            left join member m on d.member_id = m.id
                        WHERE
                            YEAR(FROM_UNIXTIME(d.datetime)) = ${req.body.year}
                        GROUP BY
                            FROM_UNIXTIME(datetime);`
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
                                left join member m on d.member_id = m.id
                            WHERE
                                YEAR(FROM_UNIXTIME(d.datetime)) = ${req.body.year}
                            GROUP BY
                                YEAR(FROM_UNIXTIME(datetime));`
            async.parallel([
                function (callback) {
                    mysql.query(month_query, (error, data) => {
                        if(error){
                            callback(error,null)
                        }else{
                            callback(null, data)
                        }
                        
                    })
                }
                , function (callback) {
                    mysql.query(year_query, (error, data) => {
                        if(error){
                            callback(error,null)
                        }else{
                            callback(null, data)
                        }
                        
                    })
                }
            ], function (err, results) {
                if(err){
                    logger.error("Death Report Exception :---->")
                    logger.error(err)
                    return res.json({ "status": 'error', "message": 'Something broken!' });
                }
                // final callback
                var newResult = results[1][0];
                newResult['months'] = results[0];
                return res.json({ "status": 'success', "data": newResult });
            });
            
            
        }
        catch (err) {
            logger.error("Death Report Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": 'Something broken!' })
        }
    }
}


module.exports = new Report()


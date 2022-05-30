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
                        if(req.body.year){
                            month_query += ` WHERE YEAR(FROM_UNIXTIME(d.datetime)) = ${req.body.year}`;
                        }
                        month_query += ` GROUP BY FROM_UNIXTIME(datetime);`;
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
                            if(req.body.year){
                                year_query += ` WHERE YEAR(FROM_UNIXTIME(d.datetime)) = ${req.body.year}`;
                            }
                            year_query += ` GROUP BY YEAR(FROM_UNIXTIME(datetime));`;
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
                var yearResult = results[1];
                var monthResult = results[0];
                yearResult.forEach(yearItem => {
                    yearItem["months"] = []
                    monthResult.forEach(monthItem => {
                        if(yearItem.year == monthItem.year){
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
        var sequelize = req.app.get('sequelize')
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
                        if(req.body.year){
                            month_query += ` WHERE YEAR(FROM_UNIXTIME(c.created_on)) = ${req.body.year}`;
                        }
                        month_query += ` GROUP BY FROM_UNIXTIME(c.created_on);`;
            var year_query = `SELECT
                                DATE_FORMAT(FROM_UNIXTIME(c.created_on), '%Y') year,
                                SUM(if(c.paid = 1,ca.amount,0)) collected,
                                SUM(if(c.paid = 0,ca.amount,0)) pending,
                                SUM(ca.amount) total
                            FROM
                                collection c
                                left join collection_amount ca on c.amount_id = ca.id`;
                            if(req.body.year){
                                year_query += ` WHERE YEAR(FROM_UNIXTIME(c.created_on)) = ${req.body.year}`;
                            }
                            year_query += ` GROUP BY YEAR(FROM_UNIXTIME(c.created_on));`;
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
                var yearResult = results[1];
                var monthResult = results[0];
                yearResult.forEach(yearItem => {
                    yearItem["months"] = []
                    monthResult.forEach(monthItem => {
                        if(yearItem.year == monthItem.year){
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
}


module.exports = new Report()


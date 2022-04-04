"use strict";
var path = require('path')
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
var sess = require('../helper/session')

class Index {

    constructor() {

    }

    home(req, res) {
        var logger = req.app.get('logger')
        logger.log("log test")
        logger.info("log info")
        logger.error("log error")
        logger.warn("log warn")
        res.json(req.session)
    };
    login(req, res) {
        var user_name = req.body.user
        var pwd = req.body.pwd
        //var user_name = req.query.user
        //var pwd = req.query.pwd
        var _this = this

        //check given user exist or not
        //prepare cutom SQL
        var sequelize = req.app.get('sequelize')
        const Op = sequelize.Sequelize.Op;
        res.json({success: true, data: {}})
    }

    logout(req, res) {
        sess.setLogout(req);
        return res.json({ "status": "success" })
    }


}

module.exports = new Index();


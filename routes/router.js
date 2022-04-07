var path = require('path')
var path_controller = path.normalize(__dirname + "/../controllers")
var path_services = path.normalize(__dirname + "/../services")
var index = require(path_services + '/index');
var user = require(path_services + '/user');
var member = require(path_services + '/member');
module.exports = function(app) {
 
    app.get('/',  function(req, res)  {
        var logger = app.get('logger')
        logger.log("log message")
        logger.info("info message")
        logger.warn("warn message")
        logger.error("error message")
        index.home(req, res)
    });
    app.post('/user/register',  function(req, res)  {
        user.create(req, res)
    });
    app.post('/member/register',  function(req, res)  {
        member.createMember(req, res)
    });
}
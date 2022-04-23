var path = require('path');

var path_controller = path.normalize(__dirname + "/../controllers")
var path_services = path.normalize(__dirname + "/../services")
const index = require(path_services + '/index');
const user = require(path_services + '/user');
const member = require(path_services + '/member');
const collection = require(path_services +'/collection');
const death = require(path_services +'/death');
const collector = require(path_services + '/collector');
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
    app.post('/member/list',  function(req, res)  {
        member.listMember(req, res)
    });
    app.post('/collection/list',  function(req, res)  {
        collection.listCollection(req, res)
    });
    app.post('/death/create',  function(req, res)  {
        death.createDeath(req, res)
    });
    app.post('/collector/create',  function(req, res)  {
        collector.createDeath(req, res)
    });
    app.post('/collector/list',  function(req, res)  {
        collector.listCollector(req, res)
    });
}
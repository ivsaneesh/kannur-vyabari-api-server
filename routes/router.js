var path = require('path');

var path_controller = path.normalize(__dirname + "/../controllers")
var path_services = path.normalize(__dirname + "/../services")
const index = require(path_services + '/index');
const user = require(path_services + '/user');
const member = require(path_services + '/member');
const collection = require(path_services +'/collection');
const death = require(path_services +'/death');
const collector = require(path_services + '/collector');
const unit = require(path_services + '/unit');
const area = require(path_services + '/area');
const bank = require(path_services + '/bank');
const upload = require(path_services + '/upload');
const report = require(path_services + '/report');

module.exports = function(app) {
 
    app.get('/',  function(req, res)  {
        var logger = app.get('logger')
        logger.log("log message")
        logger.info("info message")
        logger.warn("warn message")
        logger.error("error message")
        index.home(req, res)
    });
    app.post('/login',  function(req, res)  {
        index.login(req, res)
    });
    app.post('/logout',  function(req, res)  {
        index.logout(req, res)
    });
    /// user
    app.post('/user/register',  function(req, res)  {
        user.create(req, res)
    });
    app.post('/user/list',  function(req, res)  {
        user.listUser(req, res)
    });
    /// member
    app.post('/member/register', function(req, res)  {
        member.createMember(req, res)
    });
    app.post('/member/list',  function(req, res)  {
        member.listMember(req, res)
    });
    app.put('/member/update',  function(req, res)  {
        member.updateMember(req, res)
    });
    /// collection
    app.get('/collectionAmount',  function(req, res)  {
        collection.collectionAmount(req, res)
    });
    app.post('/collectionAmount/create',  function(req, res)  {
        collection.createCollectionAmount(req, res)
    });
    app.post('/collection/list',  function(req, res)  {
        collection.listCollection(req, res)
    });
    app.put('/collection/update',  function(req, res)  {
        collection.updateCollection(req, res)
    });
    /// death
    app.post('/death/create',  function(req, res)  {
        death.createDeath(req, res)
    });
    /// collector
    app.post('/collector/create',  function(req, res)  {
        collector.createCollector(req, res)
    });
    app.post('/collector/list',  function(req, res)  {
        collector.listCollector(req, res)
    });
    app.put('/collector/update',  function(req, res)  {
        collector.updateCollector(req, res)
    });
    /// unit
    app.post('/unit/create',  function(req, res)  {
        unit.createUnit(req, res)
    });
    app.post('/unit/list',  function(req, res)  {
        unit.listUnit(req, res)
    });
    app.put('/unit/update',  function(req, res)  {
        unit.updateUnit(req, res)
    });
    app.delete('/unit/delete',  function(req, res)  {
        unit.deleteUnit(req, res)
    });
    /// area
    app.post('/area/create',  function(req, res)  {
        area.createArea(req, res)
    });
    app.post('/area/list',  function(req, res)  {
        area.listArea(req, res)
    });
    app.put('/area/update',  function(req, res)  {
        area.updateArea(req, res)
    });
    app.delete('/area/delete',  function(req, res)  {
        area.deleteArea(req, res)
    });
    /// bank
    app.post('/bank/create',  function(req, res)  {
        bank.createBank(req, res)
    });
    app.post('/bank/list',  function(req, res)  {
        bank.listBank(req, res)
    });
    app.put('/bank/update',  function(req, res)  {
        bank.updateBank(req, res)
    });
    app.delete('/bank/delete',  function(req, res)  {
        bank.deleteBank(req, res)
    });
    /// bank transcation
    app.post('/bankTrans/create',  function(req, res)  {
        bank.createBankTrans(req, res)
    });
    app.post('/bankTrans/list',  function(req, res)  {
        bank.listBankTrans(req, res)
    });
    ///upload
    app.post('/upload',  function(req, res)  {
        upload.uploadFile(req, res)
    });
    //report
    app.post('/report/death', function(req, res)  {
        report.deathReport(req, res)
    });
    app.post('/report/collection', function(req, res)  {
        report.collectionReport(req, res)
    });
}
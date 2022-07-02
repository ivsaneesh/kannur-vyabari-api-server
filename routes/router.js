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
const entity = require(path_services + '/external_entity');
const registratioFee = require(path_services + '/registration_fee');
const offer = require(path_services + '/offer');
const dashboard = require(path_services +'/dashboard');
const payout = require(path_services + '/payout');
const wallet = require(path_services + '/wallet');


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
        if(req.user.type.includes('admin'))
        user.create(req, res)
    });
    app.post('/user/list',  function(req, res)  {
        if(req.user.type.includes('admin'))
        user.listUser(req, res)
    });
    app.put('/user/update',  function(req, res)  {
        if(req.user.type.includes('admin'))
        user.updateUser(req, res)
    });
    app.delete('/user/delete',  function(req, res)  {
        if(req.user.type.includes('admin'))
        user.deleteUser(req, res)
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
    app.delete('/member/delete',  function(req, res)  {
        if(req.user.type.includes('admin'))
        member.deleteMember(req, res)
    });
    /// collection
    app.get('/collectionAmount',  function(req, res)  {
        collection.collectionAmount(req, res)
    });
    app.post('/collectionAmount/create',  function(req, res)  {
        if(req.user.type.includes('admin'))
        collection.createCollectionAmount(req, res)
    });
    app.post('/collection/list',  function(req, res)  {
        if(req.user.type.includes('admin'))
        collection.listCollection(req, res)
    });
    app.put('/collection/update',  function(req, res)  {
        if(req.user.type.includes('admin'))
        collection.updateCollection(req, res)
    });
    /// death
    app.post('/death/create',  function(req, res)  {
        if(req.user.type.includes('admin'))
        death.createDeath(req, res)
    });
    /// collector
    app.post('/collector/create',  function(req, res)  {
        if(req.user.type.includes('admin'))
        collector.createCollector(req, res)
    });
    app.post('/collector/list',  function(req, res)  {
        if(req.user.type.includes('admin'))
        collector.listCollector(req, res)
    });
    app.put('/collector/update',  function(req, res)  {
        if(req.user.type.includes('admin'))
        collector.updateCollector(req, res)
    });
    app.delete('/collector/delete',  function(req, res)  {
        if(req.user.type.includes('admin'))
        collector.deleteCollector(req, res)
    });
    /// unit
    app.post('/unit/create',  function(req, res)  {
        if(req.user.type.includes('admin'))
        unit.createUnit(req, res)
    });
    app.post('/unit/list',  function(req, res)  {
        unit.listUnit(req, res)
    });
    app.put('/unit/update',  function(req, res)  {
        if(req.user.type.includes('admin'))
        unit.updateUnit(req, res)
    });
    app.delete('/unit/delete',  function(req, res)  {
        if(req.user.type.includes('admin'))
        unit.deleteUnit(req, res)
    });
    /// area
    app.post('/area/create',  function(req, res)  {
        if(req.user.type.includes('admin'))
        area.createArea(req, res)
    });
    app.post('/area/list',  function(req, res)  {
        area.listArea(req, res)
    });
    app.put('/area/update',  function(req, res)  {
        if(req.user.type.includes('admin'))
        area.updateArea(req, res)
    });
    app.delete('/area/delete',  function(req, res)  {
        if(req.user.type.includes('admin'))
        area.deleteArea(req, res)
    });
    /// bank
    app.post('/bank/create',  function(req, res)  {
        if(req.user.type.includes('admin'))
        bank.createBank(req, res)
    });
    app.post('/bank/list',  function(req, res)  {
        if(req.user.type.includes('admin'))
        bank.listBank(req, res)
    });
    app.put('/bank/update',  function(req, res)  {
        if(req.user.type.includes('admin'))
        bank.updateBank(req, res)
    });
    app.delete('/bank/delete',  function(req, res)  {
        if(req.user.type.includes('admin'))
        bank.deleteBank(req, res)
    });
    /// bank transcation
    app.post('/bankTrans/create',  function(req, res)  {
        if(req.user.type.includes('admin'))
        bank.createBankTrans(req, res)
    });
    app.post('/bankTrans/list',  function(req, res)  {
        if(req.user.type.includes('admin'))
        bank.listBankTrans(req, res)
    });
    ///upload
    app.post('/upload',  function(req, res)  {
        upload.uploadFile(req, res)
    });
    //report
    app.post('/report/death', function(req, res)  {
        if(req.user.type.includes('admin'))
        report.deathReport(req, res)
    });
    app.post('/report/collection', function(req, res)  {
        if(req.user.type.includes('admin'))
        report.collectionReport(req, res)
    });
    app.post('/report/payout/member', function(req, res)  {
        if(req.user.type.includes('admin'))
        report.memberPayoutReport(req, res)
    });
    app.post('/report/payout/area', function(req, res)  {
        if(req.user.type.includes('admin'))
        report.areaPayoutReport(req, res)
    });
    app.post('/report/payout/unit', function(req, res)  {
        if(req.user.type.includes('admin'))
        report.unitPayoutReport(req, res)
    });
    app.post('/report/payout/district', function(req, res)  {
        if(req.user.type.includes('admin'))
        report.districtPayoutReport(req, res)
    });
  
    // external entity
    app.post('/entity/create', function(req, res)  {
        if(req.user.type.includes('admin'))
        entity.createExternalEntity(req, res)
    }); 
    app.post('/entity/list', function(req, res)  {
        if(req.user.type.includes('admin'))
        entity.listExternalEntity(req, res)
    }); 
    app.put('/entity/update', function(req, res)  {
        if(req.user.type.includes('admin'))
        entity.updateExternalEntity(req, res)
    }); 
    app.delete('/entity/delete', function(req, res)  {
        if(req.user.type.includes('admin'))
        entity.deleteExternalEntity(req, res)
    });
    // registration fee
    app.post('/regitratioFee/create', function(req, res)  {
        if(req.user.type.includes('admin'))
        registratioFee.createRegistratioFee(req, res)
    }); 
    app.post('/regitratioFee/list', function(req, res)  {
        if(req.user.type.includes('admin'))
        registratioFee.listRegistratioFee(req, res)
    });
    app.delete('/regitratioFee/delete', function(req, res)  {
        if(req.user.type.includes('admin'))
        registratioFee.deleteRegistratioFee(req, res)
    });
    /// offer
    app.post('/offer/create', function(req, res)  {
        if(req.user.type.includes('admin'))
        offer.createOffer(req, res)
    }); 
    app.post('/offer/list', function(req, res)  {
        if(req.user.type.includes('admin'))
        offer.listOffer(req, res)
    }); 
    app.put('/offer/update', function(req, res)  {
        if(req.user.type.includes('admin'))
        offer.updateOffer(req, res)
    }); 
    app.delete('/offer/delete', function(req, res)  {
        if(req.user.type.includes('admin'))
        offer.deleteOffer(req, res)
    });
    // dashboard
    app.get('/dashboard', function(req, res)  {
        dashboard.dashboardCount(req, res)
    }); 
  
    
    app.post('/changeMemberId', function(req, res)  {
        if(req.user.type.includes('admin'))
        member.changeMemberId(req, res)
    }); 
    //Payout
    app.post('/payout/member/create', function(req, res)  {
        if(req.user.type.includes('admin'))
        payout.createMemberPayout(req, res)
    }); 
    app.post('/payout/member/list', function(req, res)  {
        if(req.user.type.includes('admin'))
        payout.listMemberPayout(req, res)
    });
    app.post('/payout/unit/create', function(req, res)  {
        if(req.user.type.includes('admin'))
        payout.createUnitPayout(req, res)
    }); 
    app.post('/payout/unit/list', function(req, res)  {
        if(req.user.type.includes('admin'))
        payout.listUnitPayout(req, res)
    });
    app.post('/payout/area/create', function(req, res)  {
        if(req.user.type.includes('admin'))
        payout.createAreaPayout(req, res)
    }); 
    app.post('/payout/area/list', function(req, res)  {
        if(req.user.type.includes('admin'))
        payout.listAreaPayout(req, res)
    });
    app.post('/payout/district/create', function(req, res)  {
        if(req.user.type.includes('admin'))
        payout.createDistrictPayout(req, res)
    }); 
    app.post('/payout/district/list', function(req, res)  {
        if(req.user.type.includes('admin'))
        payout.listDistrictPayout(req, res)
    });
    app.post('/payout/collector/create', function(req, res)  {
        if(req.user.type.includes('admin'))
        payout.createCollectorPayout(req, res)
    }); 
    app.post('/payout/collector/list', function(req, res)  {
        if(req.user.type.includes('admin'))
        payout.listCollectorPayout(req, res)
    });
    /// wallet
    app.post('/wallet/create', function(req, res)  {
        if(req.user.type.includes('admin'))
        wallet.addToWallet(req, res)
    }); 
    app.post('/wallet/credit/list', function(req, res)  {
        if(req.user.type.includes('admin'))
        wallet.listCreditWallet(req, res)
    });
    app.post('/wallet/transcation', function(req, res)  {
        if(req.user.type.includes('admin'))
        wallet.listWalletTranscation(req, res)
    });
    app.post('/wallet/list', function(req, res)  {
        if(req.user.type.includes('admin'))
        wallet.listMemberWallet(req, res)
    });
    
}
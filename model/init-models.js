var DataTypes = require("sequelize").DataTypes;
var _area = require("./area");
var _area_payout = require("./area_payout");
var _bank = require("./bank");
var _bank_transaction = require("./bank_transaction");
var _business = require("./business");
var _charity = require("./charity");
var _cheque = require("./cheque");
var _collection = require("./collection");
var _collection_amount = require("./collection_amount");
var _collection_partition = require("./collection_partition");
var _collector = require("./collector");
var _collector_payout = require("./collector_payout");
var _commition = require("./commition");
var _death = require("./death");
var _designation = require("./designation");
var _director_board = require("./director_board");
var _district_payout = require("./district_payout");
var _event_payout = require("./event_payout");
var _events = require("./events");
var _external_entity = require("./external_entity");
var _external_member = require("./external_member");
var _family = require("./family");
var _ledger = require("./ledger");
var _maintainance_amount = require("./maintainance_amount");
var _member = require("./member");
var _member_payout = require("./member_payout");
var _nominee = require("./nominee");
var _offer_given = require("./offer_given");
var _offers = require("./offers");
var _permission = require("./permission");
var _registration_fee = require("./registration_fee");
var _registration_fee_collected = require("./registration_fee_collected");
var _reminder_details = require("./reminder_details");
var _sms = require("./sms");
var _sms_charge = require("./sms_charge");
var _unit = require("./unit");
var _unit_payout = require("./unit_payout");
var _user = require("./user");
var _user_permissions = require("./user_permissions");

function initModels(sequelize) {
  var area = _area(sequelize, DataTypes);
  var area_payout = _area_payout(sequelize, DataTypes);
  var bank = _bank(sequelize, DataTypes);
  var bank_transaction = _bank_transaction(sequelize, DataTypes);
  var business = _business(sequelize, DataTypes);
  var charity = _charity(sequelize, DataTypes);
  var cheque = _cheque(sequelize, DataTypes);
  var collection = _collection(sequelize, DataTypes);
  var collection_amount = _collection_amount(sequelize, DataTypes);
  var collection_partition = _collection_partition(sequelize, DataTypes);
  var collector = _collector(sequelize, DataTypes);
  var collector_payout = _collector_payout(sequelize, DataTypes);
  var commition = _commition(sequelize, DataTypes);
  var death = _death(sequelize, DataTypes);
  var designation = _designation(sequelize, DataTypes);
  var director_board = _director_board(sequelize, DataTypes);
  var district_payout = _district_payout(sequelize, DataTypes);
  var event_payout = _event_payout(sequelize, DataTypes);
  var events = _events(sequelize, DataTypes);
  var external_entity = _external_entity(sequelize, DataTypes);
  var external_member = _external_member(sequelize, DataTypes);
  var family = _family(sequelize, DataTypes);
  var ledger = _ledger(sequelize, DataTypes);
  var maintainance_amount = _maintainance_amount(sequelize, DataTypes);
  var member = _member(sequelize, DataTypes);
  var member_payout = _member_payout(sequelize, DataTypes);
  var nominee = _nominee(sequelize, DataTypes);
  var offer_given = _offer_given(sequelize, DataTypes);
  var offers = _offers(sequelize, DataTypes);
  var permission = _permission(sequelize, DataTypes);
  var registration_fee = _registration_fee(sequelize, DataTypes);
  var registration_fee_collected = _registration_fee_collected(sequelize, DataTypes);
  var reminder_details = _reminder_details(sequelize, DataTypes);
  var sms = _sms(sequelize, DataTypes);
  var sms_charge = _sms_charge(sequelize, DataTypes);
  var unit = _unit(sequelize, DataTypes);
  var unit_payout = _unit_payout(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var user_permissions = _user_permissions(sequelize, DataTypes);


  return {
    area,
    area_payout,
    bank,
    bank_transaction,
    business,
    charity,
    cheque,
    collection,
    collection_amount,
    collection_partition,
    collector,
    collector_payout,
    commition,
    death,
    designation,
    director_board,
    district_payout,
    event_payout,
    events,
    external_entity,
    external_member,
    family,
    ledger,
    maintainance_amount,
    member,
    member_payout,
    nominee,
    offer_given,
    offers,
    permission,
    registration_fee,
    registration_fee_collected,
    reminder_details,
    sms,
    sms_charge,
    unit,
    unit_payout,
    user,
    user_permissions,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

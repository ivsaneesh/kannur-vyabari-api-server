var DataTypes = require("sequelize").DataTypes;
var _business = require("./business");
var _collection = require("./collection");
var _collection_amount = require("./collection_amount");
var _commition = require("./commition");
var _death = require("./death");
var _designation = require("./designation");
var _director_board = require("./director_board");
var _division = require("./division");
var _event_payout = require("./event_payout");
var _events = require("./events");
var _external_entity = require("./external_entity");
var _external_entity_ledger = require("./external_entity_ledger");
var _external_entity_payout = require("./external_entity_payout");
var _external_member = require("./external_member");
var _family = require("./family");
var _maintainance_amount = require("./maintainance_amount");
var _member = require("./member");
var _member_ledger = require("./member_ledger");
var _member_payout = require("./member_payout");
var _nominee = require("./nominee");
var _offer_given = require("./offer_given");
var _offers = require("./offers");
var _permission = require("./permission");
var _registration_fee = require("./registration_fee");
var _registration_fee_collected = require("./registration_fee_collected");
var _sms_charge = require("./sms_charge");
var _unit = require("./unit");
var _user = require("./user");
var _user_permissions = require("./user_permissions");

function initModels(sequelize) {
  var business = _business(sequelize, DataTypes);
  var collection = _collection(sequelize, DataTypes);
  var collection_amount = _collection_amount(sequelize, DataTypes);
  var commition = _commition(sequelize, DataTypes);
  var death = _death(sequelize, DataTypes);
  var designation = _designation(sequelize, DataTypes);
  var director_board = _director_board(sequelize, DataTypes);
  var division = _division(sequelize, DataTypes);
  var event_payout = _event_payout(sequelize, DataTypes);
  var events = _events(sequelize, DataTypes);
  var external_entity = _external_entity(sequelize, DataTypes);
  var external_entity_ledger = _external_entity_ledger(sequelize, DataTypes);
  var external_entity_payout = _external_entity_payout(sequelize, DataTypes);
  var external_member = _external_member(sequelize, DataTypes);
  var family = _family(sequelize, DataTypes);
  var maintainance_amount = _maintainance_amount(sequelize, DataTypes);
  var member = _member(sequelize, DataTypes);
  var member_ledger = _member_ledger(sequelize, DataTypes);
  var member_payout = _member_payout(sequelize, DataTypes);
  var nominee = _nominee(sequelize, DataTypes);
  var offer_given = _offer_given(sequelize, DataTypes);
  var offers = _offers(sequelize, DataTypes);
  var permission = _permission(sequelize, DataTypes);
  var registration_fee = _registration_fee(sequelize, DataTypes);
  var registration_fee_collected = _registration_fee_collected(sequelize, DataTypes);
  var sms_charge = _sms_charge(sequelize, DataTypes);
  var unit = _unit(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var user_permissions = _user_permissions(sequelize, DataTypes);


  return {
    business,
    collection,
    collection_amount,
    commition,
    death,
    designation,
    director_board,
    division,
    event_payout,
    events,
    external_entity,
    external_entity_ledger,
    external_entity_payout,
    external_member,
    family,
    maintainance_amount,
    member,
    member_ledger,
    member_payout,
    nominee,
    offer_given,
    offers,
    permission,
    registration_fee,
    registration_fee_collected,
    sms_charge,
    unit,
    user,
    user_permissions,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

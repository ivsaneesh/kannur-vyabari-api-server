/*************************
author : @Fairusudheen
generic API script
*************************/
"use strict";
class Api {

  constructor() {

  }

  //api execution point
  execute(req, res) {
    try {
      var sequelize = req.app.get('sequelize')
      var logger = req.app.get('logger')

      var model = req.params.model
      var action = this.findAction(req)

      // Check the model and action
      var valid_ret = this.validate(sequelize, model, action, req)
      if (valid_ret.status == false) {
        return res.json({ "status": "error", "message": valid_ret.message })
      }


      var column = "id"
      var columnval = req.body ? req.body.id ? req.body.id : "" : ""

      // Generate the input
      var json_obj = this.generateJSON(sequelize.models[model].rawAttributes, req)

      var result
      //execute the crud
      switch (action) {
        case "create":
          //CREATE OPERTION
          this.create(sequelize, model, json_obj, function (status, data, messge) {
            return res.json({ "status": status, "data": data, "message": messge })
          })
          break

        case "update":
          this.update(sequelize, model, json_obj, column, columnval, function (status, data, messge) {
            return res.json({ "status": status, "message": messge })
          })
          break

        case "delete":
          this.delete(sequelize, model, column, columnval, function (status, data, messge) {
            return res.json({ "status": status, "message": messge })
          })
          break

        case "findById":
          columnval = req.params ? req.params.id ? req.params.id : "" : ""
          this.findById(sequelize, model, columnval, function (status, data, messge) {
            return res.json({ "status": status, "data": data, "message": messge })
          })
          break

        case "findAll":
          var start = req.body.start ? req.body.start : 0
          var limit = req.body.limit ? req.body.limit : 10
          var json_data = { where: json_obj, "offset": start, "limit": limit }
          if (req.body.sort_column) {
            json_data.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
          }
          this.findAll(sequelize, model, json_data, function (status, data, messge) {
            return res.json({ "status": status, "data": data, "message": messge })
          })
          break

      }
    } catch (e) { return res.json({ "status": "error", "message": "Unexpected error!" }) }

  }

  //find what action need to perform
  findAction(req) {
    var action
    try {
      if (req.method == "POST" && req.params && req.params.action == "findAll") {
        //FIND ALL
        action = "findAll"
      }
      else if (req.method == "POST") {
        //CREATE ACTION
        action = "create"
      }
      else if (req.method == "PUT" && req.body && req.body.id) {
        //EDITT ACTION
        action = "update"
      }
      else if (req.method == "DELETE" && req.body && req.body.id) {
        //DELETE ACTION
        action = "delete"
      }
      else if (req.method == "GET" && req.params && req.params.id) {
        //findById ACTION
        action = "findById"
      }
    } catch (e) { }
    return action;

  }

  //validate the request
  validate(sequelize, model, action, req) {
    var ret = {}
    var error = false
    var actions = ["create", "update", "delete", "findById", "findAll"]
    try {
      if (sequelize.models[model] === undefined) {
        ret.message = "End point invalide"
        error = true
      }
      else if (actions.indexOf(action) == -1) {
        ret.message = "Action not valid"
        error = true
      }
      //update
      else if (action == "update" || action == "delete" || action == "findById") {
        //make sure primary key available
        if (!req.body && !req.body.id) {
          ret.message = "Invalid request on " + action
          error = true
        }
      }
    } catch (e) { }
    ret.status = (!error)
    return ret
  }

  //generate json parameters
  generateJSON(model, req) {
    var ret = {};
    try {
      for (var key in model) {
        if (req.body[key]) {
          ret[key] = req.body[key]
        }
      }
    } catch (e) { }
    return ret
  }


  //CRUD CREATE
  create(sequelize, model, json_obj, cb) {
    sequelize.models[model].create(json_obj).then(function (data) {
      //success
      return cb("success", data, "")
    }).catch(function (err) {
      // handle error;
      return cb("error", {}, sequelize.getErrors(err))
    })
  }

  //bulk create
  bulkCreate(sequelize, model, json_obj, cb) {
    sequelize.models[model].bulkCreate(json_obj).then(function (data) {
      //success
      return cb("success", data, "")
    }).catch(function (err) {
      // handle error;
      return cb("error", {}, sequelize.getErrors(err))
    })
  }
  //CRUD UPDATE
  update(sequelize, model, json_obj, column, columnval, cb) {
    sequelize.models[model].update(json_obj, { where: { [column]: columnval } }).then(function (data) {
      //success
      return cb("success", data, "")
    }).catch(function (err) {
      // handle error;
      return cb("error", {}, sequelize.getErrors(err))
    })
  }

  //custom update
  updateCustom(sequelize, model, columns, condition, cb) {
    sequelize.models[model].update(columns, condition).then(function (data) {
      //success
      return cb("success", data, "")
    }).catch(function (err) {
      // handle error;
      return cb("error", {}, sequelize.getErrors(err))
    })
  }

  //CRUD DELETE
  delete(sequelize, model, column, columnval, cb) {
    sequelize.models[model].destroy({ where: { [column]: columnval } }).then(function (data) {
      //success
      return cb("success", data, "")
    }).catch(function (err) {
      // handle error;
      return cb("error", {}, sequelize.getErrors(err))
    })
  }


  //Find By ID
  findById(sequelize, model, columnval, cb) {
    sequelize.models[model].findByPk(columnval).then(function (data) {
      //success
      return cb("success", data, "")
    }).catch(function (err) {
      // handle error;
      return cb("error", {}, sequelize.getErrors(err))
    })
  }

  //Find By ID using exclude
  findByIdExclude(sequelize, model, columnval, exclude_arr, cb) {
    sequelize.models[model].findByPk(columnval, { attributes: { exclude: exclude_arr } }).then(function (data) {
      //success
      return cb("success", data, "")
    }).catch(function (err) {
      // handle error;
      return cb("error", {}, sequelize.getErrors(err))
    })
  }

  //Find all
  findAll(sequelize, model, json_obj, cb) {
    sequelize.models[model].findAll(json_obj).then(function (data) {
      //success
      return cb("success", data, "")
    }).catch(function (err) {
      // handle error;
      return cb("error", {}, sequelize.getErrors(err))
    })
  }

  //Find all using exclude
  findAllExclude(sequelize, model, json_obj, cb) {
    sequelize.models[model].findAll(json_obj).then(function (data) {
      //success
      return cb("success", data, "")
    }).catch(function (err) {
      // handle error;
      return cb("error", {}, sequelize.getErrors(err))
    })
  }

  //Find all using join
  findAllCustom(sequelize, model, json, cb) {
    //supports both find all and ocunt based on pagination
    sequelize.models[model][json.pagination ? (json.pagination == 1 ? 'findAndCountAll' : 'findAll') : 'findAll'](json).then(function (data) {
      //success
      return cb("success", data, "")
    }).catch(function (err) {
      // handle error;
      console.log(err)
      return cb("error", {}, sequelize.getErrors(err))
    })
  }

  //Find all using join
  async findAllAsync(sequelize, model, json) {
    return await sequelize.models[model][json.pagination ? (json.pagination == 1 ? 'findAndCountAll' : 'findAll') : 'findAll'](json)
  }

   //Find one using join
   async findOneAsync(sequelize, model, json) {
    return await sequelize.models[model].findOne(json)
  }

  //create using async
  async createAsync(sequelize, model, json) {
    return await sequelize.models[model].create(json)
  }

  //create using async
  async bulkCreateAsync(sequelize, model, json) {
    return await sequelize.models[model].bulkCreate(json)
  }

  //CRUD CREATE WITH TRANSACTION
  async createT(sequelize, model, json_obj, transaction) {
    return await sequelize.models[model].create(json_obj, { transaction })
  }

  findAllAsyncT(sequelize, model, json, transaction) {
    return sequelize.models[model].findAll(json, { transaction })
  }

  //CRUD DELETE
  async deleteT(sequelize, model, column, columnval, transaction) {
    return await sequelize.models[model].destroy({ where: { [column]: columnval } }, { transaction })
  }

  //custom update
  async updateCustomT(sequelize, model, columns, condition, transaction) {
    return await sequelize.models[model].update(columns, condition, { transaction })
  }

  async bulkCreateT(sequelize, model, json_obj, transaction) {
    return await sequelize.models[model].bulkCreate(json_obj, { transaction })
  }


  //Find Count
  findCount(sequelize, model, json, cb) {
    sequelize.models[model]['count'](json).then(function (data) {
      return cb("success", data, "")
    }).catch(function (err) {
      // handle error;
      console.log(err)
      return cb("error", {}, sequelize.getErrors(err))
    })
  }



}

module.exports = new Api()


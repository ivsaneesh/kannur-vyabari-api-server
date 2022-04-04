var path = require('path');
var path_controller = path.normalize(__dirname + "/../controllers/");
var api = require(path_controller + '/api');

module.exports = function(app) {
    //make sure to bind object so that class functions will be accessible
    app.post('/api/:model/:action', function(req, res)  {
        /**********
        IDLE FOR  Find All 
        example /api/Topic
        **********/
        api.execute(req, res)
    })
    app.post('/api/:model', function(req, res)  {
        /**********
        IDLE FOR Create
        example /api/Topic
        **********/
        api.execute(req, res)
    })
    app.put('/api/:model/', function(req, res)  {
        /**********
        IDLE FOR Update
        example /api/Topic/update/id/3
        **********/
        api.execute(req, res)
    })
    app.delete('/api/:model/', function(req, res)  {
        /**********
        IDLE FOR Delete
        example /api/Topic/delete/id/3
        **********/
        api.execute(req, res)
    })
    app.get('/api/:model/:id', function(req, res)  {
        /**********
        find by Id
        example /api/Topic/id/3
        **********/
        api.execute(req, res)
    })
    
};
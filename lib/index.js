require('babel-core/register')
var path = require('path')
var util = require('./util')
var app = require('./express')
var router = require('./routes')
var _module = require('./module')

var models = {}, templates = {}, resources = []

module.exports = function (folder, startListen) {
  // init module
  _module.setup(folder)

  // resources
  resources = _module.resources
  resources.forEach(function (resource) {
    if (resource.restful) {
      router.resource(resource.prefix, resource.restful_model, resource.resources ? resource.resources.restful : null)
    }
    router.add(resource.prefix, resource.resources)
  })

  app.use(_module.common.obj.api_prefix || '/', router.router)

  app.route('/*').get(function (req, res) {
    res.status(404).json({ message: 'not found' })
  })

  if (startListen !== false) {
    // start express server
    var server = app.listen(_module.common.port || 9999, function () {
      var host = server.address().address;
      var port = server.address().port;

      console.log('Example app listening at http://%s:%s', host, port);
    });
  }
  return app
}

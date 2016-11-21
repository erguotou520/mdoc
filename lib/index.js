var path = require('path')
var util = require('./util')
var app = require('./express')
var router = require('./routes')
var _module = require('./module')

var models = {}, templates = {}, resources = []

function parse (obj) {
  switch (Object.prototype.toString.call(obj)) {
    case '[object String]':

      break
    case '[object Array]':
      obj.forEach(function (o) {
        parse(o)
      })
      break
    case '[object Object]':
      // model: xxx
      if (obj.hasOwnProperty('model')) {
        var model = obj.model
        if (!models[model]) {
          throw new Error('No such model: ' + model)
        }
        obj.value = util.clone(models[model])
        delete obj.model
      } else if (obj.hasOwnProperty('template')) {

      }
      break
  }
}

module.exports = function (folder) {
  // init module
  _module.setup(folder)

  // resources
  resources = util.readFolderModule(folder, 'resources')
  resources.forEach(function (resource) {
    var $resource = resource.obj
    if ($resource.restful) {
      router.resource($resource.prefix, $resource.model, $resource.resources ? $resource.resources.restful : null)
    }
    router.add($resource.prefix, $resource.resources)
  })

  app.use(_module.common.obj.api_prefix || '/', router.router)

  app.route('/*').get(function (req, res) {
    res.status(404).json({ message: 'not found' })
  })

  // start express server
  var server = app.listen(_module.common.port || 9999, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
}

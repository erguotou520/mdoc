var express = require('express')
var router = express.Router()
var util = require('./util')
var models = require('./module').models
var templates = require('./module').templates
var common = require('./module').common
var id = common.restful ? (common.restful.id || 'id') : 'id'

function resolvePath (prefix, _path) {
  if (/^\//.test(_path)) {
    return _path
  } else {
    return prefix + _path
  }
}

// get restful config
function getRestfulConfig (method, overwrite) {
  if (!(common.obj.restful && common.obj.restful[method]) && (!overwrite || !overwrite[method])) {
    throw new Error('Restfull method: "' + method + '" config not defined.')
  }
  return overwrite ? overwrite[method] : common.obj.restful[method]
}

module.exports.add = function (prefix, resources) {
  for (var url in resources) {
    var resource = resources[url]
    var okResponse = resource.res ? resource.res.ok || {} : {}
    router[resource.method || 'get'](resolvePath(prefix, (url || '')), function (req, res) {
      res.status(200).json(okResponse)
    })
  }
}

module.exports.resource = function (prefix, model, overwrite) {
  var queryTemplate = templates[getRestfulConfig('query', overwrite).template]
  // query
  router.get(prefix, function (req, res) {
    var $templateClone = util.clone(queryTemplate)
    util.replateTemplate($templateClone, models[model] || {})
    res.status(200).json($templateClone)
  })

  // get
  router.get(prefix + '/:' + id, function (req, res) {
    res.status(200).json(models[model] || {})
  })

  // create
  router.post(prefix, function (req, res) {
    res.status(200).json({})
  })

  // update
  router.put(prefix + '/:' + id, function (req, res) {
    res.status(200).json({})
  })

  // delete
  router.delete(prefix + '/:' + id , function (req, res) {
    res.status(201).json({})
  })
}

module.exports.router = router

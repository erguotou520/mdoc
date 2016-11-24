var express = require('express')
var router = express.Router()
var Mock = require('mockjs')
var util = require('./util')
var models = require('./module').models
var templates = require('./module').templates
var common = require('./module').common
var id = common.restful ? (common.restful.id || 'id') : 'id'

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
    var $okClone = util.clone(okResponse)
    var $$tmp = { tmp: $okClone }
    util.removeComment($$tmp)
    $okClone = $$tmp.tmp
    router[resource.method || 'get']((prefix + url), function (req, res) {
      res.status(resource.res.ok_status || 200).json(Mock.mock($okClone))
    })
  }
}

module.exports.resource = function (prefix, model, overwrite) {
  // for query api
  var queryTemplate = templates[getRestfulConfig('query', overwrite).template]
  var $templateClone = util.clone(queryTemplate)
  util.replateTemplate($templateClone, models[model] || {})
  var $$tmp = { tmp: $templateClone }
  util.removeComment($$tmp)
  $templateClone = $$tmp.tmp

  // for get api
  var $modelClone = util.clone(models[model] || {})
  var $$model = { tmp: $modelClone }
  util.removeComment($$model)
  $modelClone = $$model.tmp

  // query
  router.get(prefix, function (req, res) {
    res.status(200).json(Mock.mock($templateClone))
  })

  // get
  router.get(prefix + '/:' + id, function (req, res) {
    res.status(200).json(Mock.mock($modelClone))
  })

  // create
  router.post(prefix, function (req, res) {
    res.status(201).json(Mock.mock({ id: '@uuid' }))
  })

  // update
  router.put(prefix + '/:' + id, function (req, res) {
    res.sendStatus(200)
  })

  // delete
  router.delete(prefix + '/:' + id , function (req, res) {
    res.sendStatus(204)
  })
}

module.exports.router = router

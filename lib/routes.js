var express = require('express')
var router = express.Router()

// router.get('/', controller.index)

module.exports.add = function (prefix, resources) {
  for (var url in resources) {
    var resource = resources[url]
    var okResponse = resource.res ? resource.res.ok || {} : {}
    router[resource.method || 'get'](prefix + (url || '/'), function (req, res) {
      res.status(200).json(okResponse)
    })
  }
}

module.exports.resource = function (prefix, model, overwrite) {
  // query
  router.get(prefix, function (req, res) {
    res.status(200).json(model)
  })

  // get
  router.get(prefix + '/:id', function (req, res) {
    res.status(200).json(model)
  })

  // create
  router.post(prefix, function (req, res) {
    res.status(200).json({})
  })

  // update
  router.put(prefix + '/:id', function (req, res) {
    res.status(200).json({})
  })

  // delete
  router.delete(prefix + '/:id', function (req, res) {
    res.status(201).json({})
  })
}

module.exports.router = router

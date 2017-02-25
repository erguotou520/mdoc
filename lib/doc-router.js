var express = require('express')
var router = express.Router()
var _module = require('./module')

router.get('/', function (req, res) {
  res.render('index', Object.assign({}, _module, {
    isHome: true,
    isApi: false,
    isHistory: false
  }))
})

router.get('/api', function (req, res) {
  res.render('api', Object.assign({}, _module, {
    isHome: false,
    isApi: true,
    isHistory: false
  }))
})

router.get('/history', function (req, res) {
  res.render('history', Object.assign({}, _module, {
    isHome: false,
    isApi: false,
    isHistory: true
  }))
})

module.exports = router

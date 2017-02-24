var express = require('express')
var router = express.Router()
var _module = require('./module')

router.get('/', function (req, res) {
  console.log('doc')
  res.render('index', _module)
})

module.exports = router

var express = require('express')
var app = express()
var hbs = require('hbs')
var path = require('path')
var compression = require('compression')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var common = require('./module').common

// hbs helper
// hbs.registerHelper('isArray', function(value) {
//   return Array.isArray(value)
// })
// hbs.registerHelper('isString', function(value) {
//   return typeof value === 'string'
// })

// render
app.set('views', common.obj.themePath)
app.set('view engine', 'hbs')
// style
app.use(common.obj.doc_prefix + '/static', require('stylus').middleware(path.join(common.obj.themePath, 'public')))
// static files
app.use(common.obj.doc_prefix + '/static', express.static(path.join(common.obj.themePath, 'public')))

app.use(compression())
app.use(bodyParser.urlencoded({ extended: false, limit: '10240000kb' }))
app.use(bodyParser.json())
app.use(methodOverride())
module.exports = app

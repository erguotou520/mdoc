var express = require('express')
var app = express()
var path = require('path')
var compression = require('compression')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var common = require('./module').common

// render
app.set('views', common.themePath)
app.set('view engine', 'hbs')
app.use(require('stylus').middleware(path.join(common.themePath, 'public')))
app.use(common.doc_prefix, express.static(path.join(common.themePath, 'public')))

app.use(compression())
app.use(bodyParser.urlencoded({ extended: false, limit: '10240000kb' }))
app.use(bodyParser.json())
app.use(methodOverride())

module.exports = app

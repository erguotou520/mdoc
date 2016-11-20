var express = require('express')
var app = express()
var path = require('path')
var compression = require('compression')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var cookieParser = require('cookie-parser')

// render
// app.set('views', '../views/theme/default')
// app.engine('html', require('ejs').renderFile)
// app.set('view engine', 'html')

app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(cookieParser())

module.exports = app

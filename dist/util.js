'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObject = isObject;
exports.deepAssign = deepAssign;
exports.readYaml = readYaml;

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

require('colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
// import path from 'path'
function deepAssign(obj) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var source = _step.value;

      if (source && isObject(source)) {
        for (var key in source) {
          if (isObject(source[key])) {
            if (!obj.hasOwnProperty(key)) {
              obj[key] = {};
            }
            deepAssign(obj[key], source[key]);
          } else {
            obj[key] = source[key];
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function readYaml(path) {
  var str = void 0;
  try {
    str = _fs2.default.readFileSync(path, 'utf8');
  } catch (e) {
    console.log(e.toString().cyan);
  }
  return _jsYaml2.default.safeLoad(str || '');
}
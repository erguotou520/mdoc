yaml = require('utils-yaml-parse');
fs   = require('fs');

// Get document, or throw exception on error
try {
  var doc = yaml(fs.readFileSync('./common.yaml', 'utf8'));
  console.log(doc);
} catch (e) {
  console.log(e);
}

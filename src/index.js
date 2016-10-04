const Store = require('./store');
const Collection = require('./collection');
require('es6-promise').polyfill();

module.exports = Store;
module.exports.Collection = Collection;

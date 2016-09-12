import Store from './store';
import Collection from './collection';
require('es6-promise').polyfill();

Store.Collection = Collection;

module.exports = Store;

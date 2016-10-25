'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fluxStandardAction = require('flux-standard-action');

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The Store holds the whole application state and it's mutation logic.
 */
var Store = function () {
    function Store() {
        _classCallCheck(this, Store);

        this.middlewares = [];
        this.queued = Promise.resolve();
    }

    _createClass(Store, [{
        key: 'use',

        /**
         * Adds an observer for mutations in the store's collections
         * @param {function|string|object} middleware|type|{type:middleware}
         * @param {function} middleware - function to execute each time an action dispatches before it reaches the reducers.
         * @returns {Store} this
         */
        value: function use(middleware) {
            var _arguments = Array.prototype.slice.call(arguments);

            var arg0 = _arguments[0];
            var arg1 = _arguments[1];

            this.middlewares.push({
                // store.use(function)
                function: middleware,
                // store.use(string, function)
                string: function string(action) {
                    if (action.type === arg0) {
                        return arg1(action);
                    }
                },

                // store.use(object)
                object: function object(action) {
                    if (arg0[action.type]) {
                        return arg0[action.type](action);
                    }
                }
            }[typeof arg0 === 'undefined' ? 'undefined' : _typeof(arg0)]);
            return this;
        }
        /**
         * Dispatches a Flux Standard Action on the state.
         * @param {object} action - FSA
         * @returns {Promise} - resolves to the mutated store state.
         */

    }, {
        key: 'dispatch',
        value: function dispatch(action) {
            var _this = this;

            var middlewares = this.middlewares;
            var collectionEntries = this.collectionEntries;

            if (!(0, _fluxStandardAction.isFSA)(action)) {
                throw new TypeError('Dispatched action must follow the Flux Standard Action scheme. https://github.com/acdlite/flux-standard-action');
            }
            // wait for the middlewares to mutate the actions
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var middleware = _step.value;

                    _this.queue(function () {
                        return Promise.resolve(middleware(action));
                    });
                };

                for (var _iterator = middlewares[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
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

            return this.queue(function () {
                return Promise.all(collectionEntries.map(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 2);

                    var name = _ref2[0];
                    var collection = _ref2[1];
                    var state = collection.state;
                    var reducers = collection.reducers;
                    var subscribers = collection.subscribers;

                    if (!reducers[action.type]) {
                        return Promise.resolve();
                    }
                    return Promise.resolve(reducers[action.type](state, action)).then(function () {
                        var newCollectionState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state;

                        if (newCollectionState !== state) {
                            collection.state = newCollectionState;
                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                                for (var _iterator2 = subscribers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var subscriber = _step2.value;

                                    subscriber(_this.state, action, name);
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }
                        }
                        return newCollectionState;
                    });
                })).then(function () {
                    return _this.state;
                }).catch(function (err) {
                    throw err;
                });
            });
        }
        /**
         * Subscribes for mutations in the store's collections.
         * @param {string | array} collectionNames - collections to subscribe to.
         * @param {function} subscriber - function to execute each time the collection state mutates
         * @returns {undefined}
         */

    }, {
        key: 'subscribe',
        value: function subscribe(collectionNames, subscriber) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _utils.forceArray)(collectionNames)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var name = _step3.value;

                    this[name].subscribers.push(subscriber);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
        /**
         * Unsubscribes the subscriber function provided for the collections.
         * @param {string | array} collectionNames - collections to unsubscribe to.
         * @param {function} subscriber - a function that was assigned for those collections mutations.
         * @returns {undefined}
         */

    }, {
        key: 'unsubscribe',
        value: function unsubscribe(collectionNames, subscriber) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = (0, _utils.forceArray)(collectionNames)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var name = _step4.value;

                    this[name].subscribers = this[name].subscribers.filter(function (func) {
                        return func === subscriber;
                    });
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
        /**
         * Adds a function to the store's execute queue
         * @param {function} action - function to apply
         * @returns {Promise} - resolves after the action resolves.
         */

    }, {
        key: 'queue',
        value: function queue(action) {
            return this.queued = this.queued.then(action);
        }
    }, {
        key: 'state',

        /**
         * object with mutations of the collections' states
         */
        get: function get() {
            return new _state2.default(this);
        }
        /**
        * Array of the collection names.
        */

    }, {
        key: 'collectionNames',
        get: function get() {
            var _this2 = this;

            return Object.keys(this).filter(function (key) {
                return _this2[key] instanceof _collection2.default;
            });
        }
        /**
         * Array of the collection objects.
         */

    }, {
        key: 'collections',
        get: function get() {
            return Object.values(this).filter(function (value) {
                return value instanceof _collection2.default;
            });
        }
        /**
         * Array of the collections entries.
         */

    }, {
        key: 'collectionEntries',
        get: function get() {
            return Object.entries(this).filter(function (entry) {
                return entry[1] instanceof _collection2.default;
            });
        }
    }]);

    return Store;
}();

exports.default = Store;
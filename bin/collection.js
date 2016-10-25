'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = function () {
    function Collection(init) {
        _classCallCheck(this, Collection);

        this.reducers = {};
        this.subscribers = [];

        var set = this.set.bind(this);
        Object.defineProperty(this, 'state', {
            get: function get() {
                return Object.freeze(Object.assign({ set: set }, init));
            },
            set: function set(state) {
                init = state;
                return this.state;
            }
        });
    }
    /**
     * Adds a reducer for specific action types.
     * @param {array | string} types - action types to apply reducer on.
     * @param {function} reducer - a function which mutates the collection state by returning it's new state.
     * @returns {Collection} this
     */


    _createClass(Collection, [{
        key: 'on',
        value: function on(types, reducer) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _utils.forceArray)(types)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var type = _step.value;

                    this.reducers[type] = reducer;
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

            return this;
        }
        /**
         * Mutates the current state with new data.
         * @param {object} data - the new data to assign to the state.
         * @returns {object} state - the new state.
         */

    }, {
        key: 'set',
        value: function set(data) {
            return Object.assign(new this.state.constructor(), this.state, data);
        }
    }]);

    return Collection;
}();

exports.default = Collection;
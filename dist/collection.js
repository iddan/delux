'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = function Collection(init) {
	var _this = this;

	_classCallCheck(this, Collection);

	this.reducers = {};
	this.subscribers = [];

	this.on = function (types, reducer) {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = (0, _utils.forceArray)(types)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var type = _step.value;

				_this.reducers[type] = reducer;
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

		return _this;
	};

	this.set = function (data) {
		return Object.assign(new _this.state.constructor(), _this.state, data);
	};

	var set = this.set;

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

/**
 * Mutates the current state with new data.
 * @param {object} data - the new data to assign to the state.
 * @returns {object} state - the new state.
 */
;

exports.default = Collection;
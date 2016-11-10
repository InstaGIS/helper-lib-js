(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery'), require('gmaps')) :
    typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'gmaps'], factory) :
    (factory((global.IGProviders = global.IGProviders || {}),global.$,global.gmaps));
}(this, (function (exports,$,gmaps) { 'use strict';

$ = 'default' in $ ? $['default'] : $;
gmaps = 'default' in gmaps ? gmaps['default'] : gmaps;

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function (object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol = root$1.Symbol;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$2.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$2.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$3.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  value = Object(value);
  return symToStringTag && symToStringTag in value ? getRawTag(value) : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$1.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function () {
  return arguments;
}()) ? baseIsArguments : function (value) {
  return isObjectLike(value) && hasOwnProperty$1.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root$1.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag = '[object Function]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag = '[object Object]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = function () {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}();

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray$1(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (
    // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' ||
    // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') ||
    // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
    // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$5;

  return value === proto;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag$1 = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function (collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/** Used to detect overreaching core-js shims. */
var coreJsData = root$1['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto$6 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty$4).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/* Built-in method references that are verified to be native. */
var Map = getNative(root$1, 'Map');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$5.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty$6.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache();
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG$1 = 1;
var PARTIAL_COMPARE_FLAG$2 = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG$2,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = bitmask & UNORDERED_COMPARE_FLAG$1 ? new SetCache() : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function (othValue, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/** Built-in value references. */
var Uint8Array = root$1.Uint8Array;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG$2 = 1;
var PARTIAL_COMPARE_FLAG$3 = 2;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]';
var dateTag$1 = '[object Date]';
var errorTag$1 = '[object Error]';
var mapTag$1 = '[object Map]';
var numberTag$1 = '[object Number]';
var regexpTag$1 = '[object RegExp]';
var setTag$1 = '[object Set]';
var stringTag$1 = '[object String]';
var symbolTag = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]';
var dataViewTag$1 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined;
var symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag$1:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$1:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$1:
    case dateTag$1:
    case numberTag$1:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag$1:
      return object.name == other.name && object.message == other.message;

    case regexpTag$1:
    case stringTag$1:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == other + '';

    case mapTag$1:
      var convert = mapToArray;

    case setTag$1:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG$3;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG$2;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG$4 = 2;

/** Used for built-in method references. */
var objectProto$10 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$10.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG$4,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$8.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/* Built-in method references that are verified to be native. */
var DataView = getNative(root$1, 'DataView');

/* Built-in method references that are verified to be native. */
var Promise$1 = getNative(root$1, 'Promise');

/* Built-in method references that are verified to be native. */
var Set = getNative(root$1, 'Set');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root$1, 'WeakMap');

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]';
var objectTag$2 = '[object Object]';
var promiseTag = '[object Promise]';
var setTag$2 = '[object Set]';
var weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView);
var mapCtorString = toSource(Map);
var promiseCtorString = toSource(Promise$1);
var setCtorString = toSource(Set);
var weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$2 || Map && getTag(new Map()) != mapTag$2 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set && getTag(new Set()) != setTag$2 || WeakMap && getTag(new WeakMap()) != weakMapTag$1) {
    getTag = function getTag(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag$2 ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
            switch (ctorString) {
                case dataViewCtorString:
                    return dataViewTag$2;
                case mapCtorString:
                    return mapTag$2;
                case promiseCtorString:
                    return promiseTag;
                case setCtorString:
                    return setTag$2;
                case weakMapCtorString:
                    return weakMapTag$1;
            }
        }
        return result;
    };
}

var getTag$1 = getTag;

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG$1 = 2;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]';
var arrayTag$1 = '[object Array]';
var objectTag$1 = '[object Object]';

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray$1(object),
      othIsArr = isArray$1(other),
      objTag = arrayTag$1,
      othTag = arrayTag$1;

  if (!objIsArr) {
    objTag = getTag$1(object);
    objTag = objTag == argsTag$2 ? objectTag$1 : objTag;
  }
  if (!othIsArr) {
    othTag = getTag$1(other);
    othTag = othTag == argsTag$2 ? objectTag$1 : othTag;
  }
  var objIsObj = objTag == objectTag$1,
      othIsObj = othTag == objectTag$1,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray(object) ? equalArrays(object, other, equalFunc, customizer, bitmask, stack) : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG$1)) {
    var objIsWrapped = objIsObj && hasOwnProperty$7.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$7.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObject(value) && !isObjectLike(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1;
var PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function (object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
  };
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function (object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function memoized() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/** `Object#toString` result references. */
var symbolTag$1 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag$1;
}

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol ? Symbol.prototype : undefined;
var symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray$1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/** Used to match property names within property paths. */
var reLeadingDot = /^\./;
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function (string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function (match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
  });
  return result;
});

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray$1(value) ? value : stringToPath(value);
}

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray$1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$1 ? '-0' : result;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return index && index == length ? object : undefined;
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) && (isArray$1(object) || isArguments(object));
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG$3 = 1;
var PARTIAL_COMPARE_FLAG$5 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function (object) {
    var objValue = get(object, path);
    return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG$3 | PARTIAL_COMPARE_FLAG$5);
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function (object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function (object) {
    return baseGet(object, path);
  };
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray$1(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
  }
  return property(value);
}

/**
 * The base implementation of `_.reduce` and `_.reduceRight`, without support
 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initAccum Specify using the first or last element of
 *  `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function (value, index, collection) {
    accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */
function reduce(collection, iteratee, accumulator) {
  var func = isArray$1(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;

  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = function () {
  function object() {}
  return function (proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = undefined;
    return result;
  };
}();

/**
 * The function whose prototype chain sequence wrappers inherit from.
 *
 * @private
 */
function baseLodash() {
  // No operation performed.
}

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
 *
 * @private
 * @constructor
 * @param {*} value The value to wrap.
 */
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__dir__ = 1;
  this.__filtered__ = false;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
  this.__views__ = [];
}

// Ensure `LazyWrapper` is an instance of `baseLodash`.
LazyWrapper.prototype = baseCreate(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;

/**
 * The base constructor for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap.
 * @param {boolean} [chainAll] Enable explicit method chain sequences.
 */
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = undefined;
}

LodashWrapper.prototype = baseCreate(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Creates a clone of `wrapper`.
 *
 * @private
 * @param {Object} wrapper The wrapper to clone.
 * @returns {Object} Returns the cloned wrapper.
 */
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper) {
    return wrapper.clone();
  }
  var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray(wrapper.__actions__);
  result.__index__ = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}

/** Used for built-in method references. */
var objectProto$11 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$11.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps `value` to enable implicit method
 * chain sequences. Methods that operate on and return arrays, collections,
 * and functions can be chained together. Methods that retrieve a single value
 * or may return a primitive value will automatically end the chain sequence
 * and return the unwrapped value. Otherwise, the value must be unwrapped
 * with `_#value`.
 *
 * Explicit chain sequences, which must be unwrapped with `_#value`, may be
 * enabled using `_.chain`.
 *
 * The execution of chained methods is lazy, that is, it's deferred until
 * `_#value` is implicitly or explicitly called.
 *
 * Lazy evaluation allows several methods to support shortcut fusion.
 * Shortcut fusion is an optimization to merge iteratee calls; this avoids
 * the creation of intermediate arrays and can greatly reduce the number of
 * iteratee executions. Sections of a chain sequence qualify for shortcut
 * fusion if the section is applied to an array of at least `200` elements
 * and any iteratees accept only one argument. The heuristic for whether a
 * section qualifies for shortcut fusion is subject to change.
 *
 * Chaining is supported in custom builds as long as the `_#value` method is
 * directly or indirectly included in the build.
 *
 * In addition to lodash methods, wrappers have `Array` and `String` methods.
 *
 * The wrapper `Array` methods are:
 * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
 *
 * The wrapper `String` methods are:
 * `replace` and `split`
 *
 * The wrapper methods that support shortcut fusion are:
 * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
 * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
 * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
 *
 * The chainable wrapper methods are:
 * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
 * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
 * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
 * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
 * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
 * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
 * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
 * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
 * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
 * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
 * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
 * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
 * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
 * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
 * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
 * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
 * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
 * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
 * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
 * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
 * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
 * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
 * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
 * `zipObject`, `zipObjectDeep`, and `zipWith`
 *
 * The wrapper methods that are **not** chainable by default are:
 * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
 * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
 * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
 * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
 * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
 * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
 * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
 * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
 * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
 * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
 * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
 * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
 * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
 * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
 * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
 * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
 * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
 * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
 * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
 * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
 * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
 * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
 * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
 * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
 * `upperFirst`, `value`, and `words`
 *
 * @name _
 * @constructor
 * @category Seq
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // Returns an unwrapped value.
 * wrapped.reduce(_.add);
 * // => 6
 *
 * // Returns a wrapped value.
 * var squares = wrapped.map(square);
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  if (isObjectLike(value) && !isArray$1(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }
    if (hasOwnProperty$9.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }
  return new LodashWrapper(value);
}

// Ensure wrappers are instances of `baseLodash`.
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;

/**
 * Creates a `lodash` wrapper instance that wraps `value` with explicit method
 * chain sequences enabled. The result of such sequences must be unwrapped
 * with `_#value`.
 *
 * @static
 * @memberOf _
 * @since 1.3.0
 * @category Seq
 * @param {*} value The value to wrap.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36 },
 *   { 'user': 'fred',    'age': 40 },
 *   { 'user': 'pebbles', 'age': 1 }
 * ];
 *
 * var youngest = _
 *   .chain(users)
 *   .sortBy('age')
 *   .map(function(o) {
 *     return o.user + ' is ' + o.age;
 *   })
 *   .head()
 *   .value();
 * // => 'pebbles is 1'
 */
function chain(value) {
  var result = lodash(value);
  result.__chain__ = true;
  return result;
}

/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */
function compact(array) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray$1(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function (value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray$1(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray$1(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

var defineProperty = function () {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}();

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/**
 * A specialized version of `baseAggregator` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}

/**
 * Aggregates elements of `collection` on `accumulator` with keys transformed
 * by `iteratee` and values set by `setter`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach(collection, function (value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function (collection, iteratee) {
    var func = isArray$1(collection) ? arrayAggregator : baseAggregator,
        accumulator = initializer ? initializer() : {};

    return func(collection, setter, baseIteratee(iteratee, 2), accumulator);
  };
}

/** Used for built-in method references. */
var objectProto$12 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$10 = objectProto$12.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The order of grouped values
 * is determined by the order they occur in `collection`. The corresponding
 * value of each key is an array of elements responsible for generating the
 * key. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.groupBy([6.1, 4.2, 6.3], Math.floor);
 * // => { '4': [4.2], '6': [6.1, 6.3] }
 *
 * // The `_.property` iteratee shorthand.
 * _.groupBy(['one', 'two', 'three'], 'length');
 * // => { '3': ['one', 'two'], '5': ['three'] }
 */
var groupBy = createAggregator(function (result, value, key) {
  if (hasOwnProperty$10.call(result, key)) {
    result[key].push(value);
  } else {
    baseAssignValue(result, key, [value]);
  }
});

/** `Object#toString` result references. */
var mapTag$3 = '[object Map]';
var setTag$3 = '[object Set]';

/** Used for built-in method references. */
var objectProto$13 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$11 = objectProto$13.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) && (isArray$1(value) || typeof value == 'string' || typeof value.splice == 'function' || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag$1(value);
  if (tag == mapTag$3 || tag == setTag$3) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty$11.call(value, key)) {
      return false;
    }
  }
  return true;
}

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function (value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray$1(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

/**
 * The base implementation of methods like `_.max` and `_.min` which accepts a
 * `comparator` to determine the extremum value.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per iteration.
 * @param {Function} comparator The comparator used to compare values.
 * @returns {*} Returns the extremum value.
 */
function baseExtremum(array, iteratee, comparator) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index],
        current = iteratee(value);

    if (current != null && (computed === undefined ? current === current && !isSymbol(current) : comparator(current, computed))) {
      var computed = current,
          result = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.gt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than `other`,
 *  else `false`.
 */
function baseGt(value, other) {
  return value > other;
}

/**
 * Computes the maximum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * _.max([]);
 * // => undefined
 */
function max(array) {
  return array && array.length ? baseExtremum(array, identity, baseGt) : undefined;
}

/**
 * The base implementation of `_.lt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than `other`,
 *  else `false`.
 */
function baseLt(value, other) {
  return value < other;
}

/**
 * Computes the minimum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * _.min([4, 2, 8, 6]);
 * // => 2
 *
 * _.min([]);
 * // => undefined
 */
function min(array) {
  return array && array.length ? baseExtremum(array, identity, baseLt) : undefined;
}

/** Used for built-in method references. */
var objectProto$14 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$12 = objectProto$14.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function assignInDefaults(objValue, srcValue, key, object) {
  if (objValue === undefined || eq(objValue, objectProto$14[key]) && !hasOwnProperty$12.call(object, key)) {
    return srcValue;
  }
  return objValue;
}

/** Used for built-in method references. */
var objectProto$15 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$13 = objectProto$15.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$13.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? func.length - 1 : start, 0);
  return function () {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function () {
    return value;
  };
}

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function (func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800;
var HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function () {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function (object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$16 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$14 = objectProto$16.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$14.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function (object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/** `Object#toString` result references. */
var objectTag$3 = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype;
var objectProto$17 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$15 = objectProto$17.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag$3) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$15.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString$2.call(Ctor) == objectCtorString;
}

/** `Object#toString` result references. */
var domExcTag = '[object DOMException]';
var errorTag$2 = '[object Error]';

/**
 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
 * @example
 *
 * _.isError(new Error);
 * // => true
 *
 * _.isError(Error);
 * // => false
 */
function isError(value) {
  if (!isObjectLike(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == errorTag$2 || tag == domExcTag || typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value);
}

/**
 * Attempts to invoke `func`, returning either the result or the caught error
 * object. Any additional arguments are provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Function} func The function to attempt.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {*} Returns the `func` result or error object.
 * @example
 *
 * // Avoid throwing errors for invalid selectors.
 * var elements = _.attempt(function(selector) {
 *   return document.querySelectorAll(selector);
 * }, '>_>');
 *
 * if (_.isError(elements)) {
 *   elements = [];
 * }
 */
var attempt = baseRest(function (func, args) {
  try {
    return apply(func, undefined, args);
  } catch (e) {
    return isError(e) ? e : new Error(e);
  }
});

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function (key) {
    return object[key];
  });
}

/** Used to escape characters for inclusion in compiled string literals. */
var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

/**
 * Used by `_.template` to escape characters for inclusion in compiled string literals.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeStringChar(chr) {
  return '\\' + stringEscapes[chr];
}

/** Used to match template delimiters. */
var reInterpolate = /<%=([\s\S]+?)%>/g;

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function (key) {
    return object == null ? undefined : object[key];
  };
}

/** Used to map characters to HTML entities. */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
var escapeHtmlChar = basePropertyOf(htmlEscapes);

/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"']/g;
var reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

/**
 * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
 * corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value. See
 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * When working with HTML you should always
 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
 * XSS vectors.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */
function escape(string) {
    string = toString(string);
    return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
}

/** Used to match template delimiters. */
var reEscape = /<%-([\s\S]+?)%>/g;

/** Used to match template delimiters. */
var reEvaluate = /<%([\s\S]+?)%>/g;

/**
 * By default, the template delimiters used by lodash are like those in
 * embedded Ruby (ERB). Change the following template settings to use
 * alternative delimiters.
 *
 * @static
 * @memberOf _
 * @type {Object}
 */
var templateSettings = {

  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'escape': reEscape,

  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'evaluate': reEvaluate,

  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'interpolate': reInterpolate,

  /**
   * Used to reference the data object in the template text.
   *
   * @memberOf _.templateSettings
   * @type {string}
   */
  'variable': '',

  /**
   * Used to import variables into the compiled template.
   *
   * @memberOf _.templateSettings
   * @type {Object}
   */
  'imports': {

    /**
     * A reference to the `lodash` function.
     *
     * @memberOf _.templateSettings.imports
     * @type {Function}
     */
    '_': { 'escape': escape }
  }
};

/** Used to match empty string literals in compiled template source. */
var reEmptyStringLeading = /\b__p \+= '';/g;
var reEmptyStringMiddle = /\b(__p \+=) '' \+/g;
var reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

/**
 * Used to match
 * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
 */
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

/** Used to ensure capturing order of template delimiters. */
var reNoMatch = /($^)/;

/** Used to match unescaped characters in compiled string literals. */
var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

/**
 * Creates a compiled template function that can interpolate data properties
 * in "interpolate" delimiters, HTML-escape interpolated data properties in
 * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
 * properties may be accessed as free variables in the template. If a setting
 * object is given, it takes precedence over `_.templateSettings` values.
 *
 * **Note:** In the development build `_.template` utilizes
 * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
 * for easier debugging.
 *
 * For more information on precompiling templates see
 * [lodash's custom builds documentation](https://lodash.com/custom-builds).
 *
 * For more information on Chrome extension sandboxes see
 * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The template string.
 * @param {Object} [options={}] The options object.
 * @param {RegExp} [options.escape=_.templateSettings.escape]
 *  The HTML "escape" delimiter.
 * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
 *  The "evaluate" delimiter.
 * @param {Object} [options.imports=_.templateSettings.imports]
 *  An object to import into the template as free variables.
 * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
 *  The "interpolate" delimiter.
 * @param {string} [options.sourceURL='templateSources[n]']
 *  The sourceURL of the compiled template.
 * @param {string} [options.variable='obj']
 *  The data object variable name.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the compiled template function.
 * @example
 *
 * // Use the "interpolate" delimiter to create a compiled template.
 * var compiled = _.template('hello <%= user %>!');
 * compiled({ 'user': 'fred' });
 * // => 'hello fred!'
 *
 * // Use the HTML "escape" delimiter to escape data property values.
 * var compiled = _.template('<b><%- value %></b>');
 * compiled({ 'value': '<script>' });
 * // => '<b>&lt;script&gt;</b>'
 *
 * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
 * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the internal `print` function in "evaluate" delimiters.
 * var compiled = _.template('<% print("hello " + user); %>!');
 * compiled({ 'user': 'barney' });
 * // => 'hello barney!'
 *
 * // Use the ES template literal delimiter as an "interpolate" delimiter.
 * // Disable support by replacing the "interpolate" delimiter.
 * var compiled = _.template('hello ${ user }!');
 * compiled({ 'user': 'pebbles' });
 * // => 'hello pebbles!'
 *
 * // Use backslashes to treat delimiters as plain text.
 * var compiled = _.template('<%= "\\<%- value %\\>" %>');
 * compiled({ 'value': 'ignored' });
 * // => '<%- value %>'
 *
 * // Use the `imports` option to import `jQuery` as `jq`.
 * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
 * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the `sourceURL` option to specify a custom sourceURL for the template.
 * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
 * compiled(data);
 * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
 *
 * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
 * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
 * compiled.source;
 * // => function(data) {
 * //   var __t, __p = '';
 * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
 * //   return __p;
 * // }
 *
 * // Use custom template delimiters.
 * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
 * var compiled = _.template('hello {{ user }}!');
 * compiled({ 'user': 'mustache' });
 * // => 'hello mustache!'
 *
 * // Use the `source` property to inline compiled templates for meaningful
 * // line numbers in error messages and stack traces.
 * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
 *   var JST = {\
 *     "main": ' + _.template(mainText).source + '\
 *   };\
 * ');
 */
function template(string, options, guard) {
  // Based on John Resig's `tmpl` implementation
  // (http://ejohn.org/blog/javascript-micro-templating/)
  // and Laura Doktorova's doT.js (https://github.com/olado/doT).
  var settings = templateSettings.imports._.templateSettings || templateSettings;

  if (guard && isIterateeCall(string, options, guard)) {
    options = undefined;
  }
  string = toString(string);
  options = assignInWith({}, options, settings, assignInDefaults);

  var imports = assignInWith({}, options.imports, settings.imports, assignInDefaults),
      importsKeys = keys(imports),
      importsValues = baseValues(imports, importsKeys);

  var isEscaping,
      isEvaluating,
      index = 0,
      interpolate = options.interpolate || reNoMatch,
      source = "__p += '";

  // Compile the regexp to match each delimiter.
  var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');

  // Use a sourceURL for easier debugging.
  var sourceURL = 'sourceURL' in options ? '//# sourceURL=' + options.sourceURL + '\n' : '';

  string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue);

    // Escape characters that can't be included in string literals.
    source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

    // Replace delimiters with snippets.
    if (escapeValue) {
      isEscaping = true;
      source += "' +\n__e(" + escapeValue + ") +\n'";
    }
    if (evaluateValue) {
      isEvaluating = true;
      source += "';\n" + evaluateValue + ";\n__p += '";
    }
    if (interpolateValue) {
      source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
    }
    index = offset + match.length;

    // The JS engine embedded in Adobe products needs `match` returned in
    // order to produce the correct `offset` value.
    return match;
  });

  source += "';\n";

  // If `variable` is not specified wrap a with-statement around the generated
  // code to add the data object to the top of the scope chain.
  var variable = options.variable;
  if (!variable) {
    source = 'with (obj) {\n' + source + '\n}\n';
  }
  // Cleanup code by stripping empty strings.
  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');

  // Frame code as the function body.
  source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '' : 'obj || (obj = {});\n') + "var __t, __p = ''" + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n" : ';\n') + source + 'return __p\n}';

  var result = attempt(function () {
    return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
  });

  // Provide the compiled function's source by its `toString` method or
  // the `source` property as a convenience for inlining compiled templates.
  result.source = source;
  if (isError(result)) {
    throw result;
  }
  return result;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY$2) ? noop : function (values) {
  return new Set(values);
};

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE$1 = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  } else if (length >= LARGE_ARRAY_SIZE$1) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache();
  } else {
    seen = iteratee ? [] : result;
  }
  outer: while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = comparator || value !== 0 ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    } else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return array && array.length ? baseUniq(array) : [];
}

var _ = {
	reduce: reduce,
	chain: chain,
	compact: compact,
	each: forEach,
	filter: filter,
	flatten: flatten,
	groupBy: groupBy,
	isEmpty: isEmpty,
	keys: keys,
	map: map,
	max: max,
	min: min,
	template: template,
	templateSettings: templateSettings,
	uniq: uniq
};

_.templateSettings = {
	interpolate: /\{\{(.+?)\}\}/g,
	evaluate: /\{\{(.+?)\}\}/g,
	escape: /\{\{-(.+?)\}\}/g
};

/**
 * Campos que no deben tomarse en cuenta a la hora de reconocer las características de un dataset
 * @type {Array}
 */
var blacklistedfields = ['id', 'strokeOpacity', 'clickable', 'strokeWeight', 'fillOpacity', 'shape', 'The_Radio_google', 'the_geom_google', 'the_radio_google', 'geocoding_address', 'gm_accessors_', 'gm_bindings_', 'icon', 'position', 'lat_google', 'lon_google', 'weight', 'id_dataset', 'id_instagis', 'location', 'point', 'center', 'value'];

var CollectionUtils = function CollectionUtils(DataSet) {

	this.DataSet = DataSet;
	this.DataSet.type = this.DataSet.type || this.DataSet.category;
	return this;
};

CollectionUtils.prototype.addGeometricBoundaries = function () {
	var element = this.DataSet,
	    html = '<h5 for="boundaries_' + element.domid + '">Filter By Boundaries</h5>';

	html += '<div class="span11  boundariescontainer" data-theproperty="boundaries">';

	html += '<select id="boundaries_' + element.domid + '" class="boundaries small span11">';
	html += '<option value="0">Any place</option>';
	html += '<option value="1">Within Visible Zone</option>';

	globalvars.mapModel.Polygons.each(function (Polygon) {
		html += _.template('<option value="{{id}}">Within {{name}}</option>')(Polygon.attributes);
	});

	html += '</select>';
	html += '</div>';
	return html;
};

/**
 * Recorre una colección y devuelve sus campos
 * @param  {gmaps.FeatureCollection | gmaps.MVCArray | gmaps.Data} [DataSet] la colección a recorrer
 * si no se especifica, usará el DataSet asignado al instanciar.
 * @return {Object}    Los campos del Dataset
 */
CollectionUtils.prototype.findFields = function (DataSet, callback) {
	var _this = this;
	var fields = {},
	    elemento;
	if (!DataSet) {
		DataSet = _this.DataSet;
	}

	if (!DataSet) {
		return fields;
	}
	return new Promise(function (resolve, reject) {

		if (DataSet.fieldsFound !== true || DataSet.fields === undefined || _.isEmpty(DataSet.fields)) {

			//console.info('getting fields for FeatureCollection');

			elemento = _.uniq(_.flatten(_.map(DataSet.getArray(), function (item) {
				var properties = item.getProperties ? item.getProperties() : item.properties;
				var keys$$1 = _.keys(properties);
				return keys$$1;
			})), false);

			//console.zlog('field Keys', elemento);

			var finalkeys = _.chain(elemento).reduce(function (memo, propiedad) {
				memo[propiedad] = {
					label: propiedad,
					value: propiedad
				};
				return memo;
			}, {}).omit(blacklistedfields).value();

			//DataSet.fields = finalkeys;
			/*_.each(finalkeys, function (attrs, fieldname) {
   	console.zlog('fieldname', fieldname, attrs);
   	console.zlog('Before DataSet.fields[', fieldname, ']', DataSet.fields, DataSet.fields[fieldname]);
   	console.zlog('After DataSet.fields[', fieldname, ']', DataSet.fields, DataSet.fields[fieldname]);
   });*/

			DataSet.fields = finalkeys;

			//console.zlog('finalkeys Object', finalkeys, 'Datasetfields', DataSet.fields);

			DataSet.fieldsFound = true;
		}

		if (DataSet.Model && DataSet.Model.columns) {
			DataSet.Model.columns.each(function (column) {
				DataSet.fields[column.get('nombre_fisico')] = {
					value: column.get('nombre_fisico'),
					label: column.get('alias')
				};
			});
		}

		if (callback) {
			callback(null, DataSet.fields);
		}
		resolve(DataSet.fields);
	});
};

/**
 * Synchronous: Recorre una colección y devuelve sus campos no numéricos
 * @param  {gmaps.FeatureCollection | gmaps.MVCArray | gmaps.Data} [DataSet] la colección a recorrer
 * si no se especifica, usará el DataSet asignado al instanciar.
 * @return {Object}    Los campos no numéricos del Dataset
 */
CollectionUtils.prototype.findQualityFields = function (DataSet) {
	var _this = this;
	var qualityfilters = {};
	if (!DataSet) {
		DataSet = _this.DataSet;
	}
	if (!DataSet.getArray || DataSet.getArray().length === 0) {
		console.zwarn('empty dataset');
		return qualityfilters;
	}

	_.each(DataSet.fields, function (propiedadObj, propiedad) {

		//console.zlog(propiedadObj, propiedad); return;
		if (propiedadObj.value) {
			var arraypropiedad = _.map(DataSet.getArray(), function (element) {
				return element.get ? element.get(propiedadObj.value) : element[propiedadObj.value]; // || element['properties']['gse_preponderante'];
			});

			if (DataSet.backend_grouped) {
				arraypropiedad = _.flatten(arraypropiedad);
			}
			var registros_numericos = _.filter(arraypropiedad, Number),
			    registros_totales = _.compact(arraypropiedad);

			// si menos de la mitad de los registros son numéricos
			if (registros_numericos.length < registros_totales.length / 2) {
				/*console.zdebug('QUALITYFILTERS ES NO NUMERICO', {
    		propiedad: propiedadObj.value,
    		registros_numericos: registros_numericos,
    		registros_totales: registros_totales,
    		//arraypropiedad: arraypropiedad,
    	});*/

				var data = _.map(_.groupBy(arraypropiedad), function (c, d) {
					return {
						name: d,
						count: c.length
					};
				});
				qualityfilters[propiedad] = {
					label: propiedadObj.label ? propiedadObj.label : propiedad,
					value: propiedadObj.value ? propiedadObj.value : propiedad,
					data: data
				};
			} else {
				//delete(DataSet.qualityfilters[propiedad]);
				/*console.zdebug('QUALITYFILTERS ES NUMERICO', {
    		propiedad: propiedadObj.value,
    		registros_numericos: registros_numericos,
    		registros_totales: registros_totales,
    		//arraypropiedad: arraypropiedad,
    	});*/

			}
		}
	});
	DataSet.qualityfilters = qualityfilters;
	//console.zdebug('DataSet qualityfilters are', qualityfilters);
	return qualityfilters;
};

/**
 * Synchronous:  Recorre una colección y devuelve sus campos numéricos
 * @param  {gmaps.FeatureCollection | gmaps.MVCArray | gmaps.Data} [DataSet] la colección a recorrer
 * si no se especifica, usará el DataSet asignado al instanciar.
 * @return {Object}    Los campos numéricos del Dataset
 */
CollectionUtils.prototype.findQuantityFields = function (DataSet) {
	var _this = this,
	    quantityfilters = {
		count: {
			value: 'count',
			label: 'count',
			min: 1,
			max: 1
		}
	};
	if (!DataSet) {
		DataSet = _this.DataSet;
	}

	if (!DataSet.getArray || !DataSet.getArray() || DataSet.getArray().length === 0) {
		//console.zdebug('empty dataset');
		return quantityfilters;
	}

	_.each(DataSet.fields, function (propiedadObj, propiedad) {
		if (propiedadObj.value !== null && propiedadObj.value !== undefined) {
			var arraypropiedad = _.map(DataSet.getArray(), function (element) {
				if (element.get) {
					return element.get(propiedadObj.value);
				} else if (element.properties) {
					return element.properties[propiedadObj.value];
				} else {
					return element[propiedadObj.value];
				}
			});

			if (DataSet.backend_grouped) {
				arraypropiedad = _.flatten(arraypropiedad);
			}

			var registros_numericos = _.filter(arraypropiedad, Number),
			    registros_totales = _.compact(arraypropiedad);

			// si al menos un quinto de los registros son numéricos para esta propiedad
			if (registros_numericos.length > registros_totales.length / 5) {

				/*console.zdebug('QUANTITYFILTERS: NUMERICO', {
    		propiedad: propiedadObj.value,
    		registros_numericos: registros_numericos,
    		registros_totales: registros_totales,
    		//arraypropiedad: arraypropiedad,
    	});*/

				var localmin = Number(_.min(_.filter(arraypropiedad, Number))),
				    localmax = Number(_.max(_.filter(arraypropiedad, Number)));

				quantityfilters[propiedad] = {
					min: Math.min(localmin, localmax),
					max: Math.max(localmin, localmax),
					label: propiedadObj.label ? propiedadObj.label : propiedad,
					value: propiedadObj.value ? propiedadObj.value : propiedad
				};
			} else {
				/*console.zdebug('QUANTITYFILTERS: NO NUMERICO', {
    		propiedad: propiedadObj.value,
    		registros_numericos: registros_numericos,
    		registros_totales: registros_totales,
    		//arraypropiedad: arraypropiedad,
    	});*/
				//delete(DataSet.quantityfilters[propiedad]);
			}
		} else {
				//console.zlog('Not value', propiedad, propiedadObj);
			}
	});

	DataSet.quantityfilters = quantityfilters;
	//console.zdebug('DataSet quantityfilters are', quantityfilters);

	return quantityfilters;
};

/**
 * Asynchronous: traverses the collection discriminating each field as quantityfilter or qualityfilder
 * @return {Promise}    A promise that resolves as a hash {qualityfilters,quantityfilters}
 */
CollectionUtils.prototype.discriminateFields = function () {
	var _this = this,
	    qualityfilters = {},
	    quantityfilters = {
		count: {
			value: 'count',
			label: 'count',
			min: 1,
			max: 1
		}
	},
	    DataSet = _this.DataSet;

	if (!DataSet.getArray || DataSet.getArray().length === 0) {
		console.zwarn('empty dataset');
		return Promise.resolve({
			quantityfilters: quantityfilters,
			qualityfilters: qualityfilters
		});
	}
	return new Promise(function (resolve, reject) {

		_.each(DataSet.fields, function (propiedadObj, propiedad) {
			if (propiedadObj.value !== null && propiedadObj.value !== undefined) {
				var arraypropiedad = _.map(DataSet.getArray(), function (element) {
					if (element.get) {
						return element.get(propiedadObj.value);
					} else if (element.properties) {
						return element.properties[propiedadObj.value];
					} else {
						return element[propiedadObj.value];
					}
				});

				if (DataSet.backend_grouped) {
					arraypropiedad = _.flatten(arraypropiedad);
				}

				var registros_numericos = _.filter(arraypropiedad, Number),
				    registros_totales = _.compact(arraypropiedad);

				// si al menos un quinto de los registros son numéricos para esta propiedad
				if (registros_numericos.length > registros_totales.length / 5) {

					var localmin = Number(_.min(_.filter(arraypropiedad, Number))),
					    localmax = Number(_.max(_.filter(arraypropiedad, Number)));

					quantityfilters[propiedad] = {
						min: Math.min(localmin, localmax),
						max: Math.max(localmin, localmax),
						label: propiedadObj.label ? propiedadObj.label : propiedad,
						value: propiedadObj.value ? propiedadObj.value : propiedad
					};
				} else {
					var data = _.map(_.groupBy(arraypropiedad), function (c, d) {
						return {
							name: d,
							count: c.length
						};
					});
					qualityfilters[propiedad] = {
						label: propiedadObj.label ? propiedadObj.label : propiedad,
						value: propiedadObj.value ? propiedadObj.value : propiedad,
						data: data
					};
				}
			}
		});

		DataSet.quantityfilters = quantityfilters;
		DataSet.qualityfilters = qualityfilters;
		//console.zdebug('DataSet qualityfilters are', qualityfilters);
		resolve({
			quantityfilters: quantityfilters,
			qualityfilters: qualityfilters
		});
	});
};

function compact$2(array) {
    var index = -1,
        length = array ? array.length : 0,
        resIndex = 0,
        result = [];

    while (++index < length) {
        var value = array[index];
        if (value) {
            result[resIndex++] = value;
        }
    }
    return result;
}

var defaults = {
    h: 1,
    s: 78, // constant saturation
    l: 63, // constant luminance
    a: 1
};

var getColor = function getColor(val, range) {
    defaults.h = Math.floor(360 / range * val);
    return "hsla(" + defaults.h + "," + defaults.s + "%," + defaults.l + "%," + defaults.a + ")";
};

var getColor1 = function getColor1() {
    return "hsla(" + defaults.h + "," + defaults.s + "%," + (defaults.l - 30) + "%," + defaults.a + ")";
};

var parseHalf = function parseHalf(foo) {
    return parseInt(foo / 2, 10);
};

var darken = function darken(stringcolor, factor) {
    var darkercolor = {};
    if (!factor) {
        factor = 1;
    }
    if (stringcolor.fillColor.indexOf('rgb') !== -1) {
        darkercolor.r = factor * parseHalf(stringcolor.r);
        darkercolor.g = factor * parseHalf(stringcolor.g);
        darkercolor.b = factor * parseHalf(stringcolor.b);
        darkercolor.fillColor = 'rgba(' + darkercolor.r + ',' + darkercolor.g + ',' + darkercolor.b + ',0.99)';
    } else if (stringcolor.fillColor.indexOf('hsl') !== -1) {
        darkercolor.h = stringcolor.h;
        darkercolor.s = stringcolor.s;
        darkercolor.l = factor * stringcolor.l - 30;
        darkercolor.fillColor = 'hsl(' + darkercolor.h + ',' + darkercolor.s + '%,' + darkercolor.l + '%)';
    }

    return darkercolor;
};

var parseHex = function parseHex(hexstring, opacity) {
    var hexcolor = {
        hex: hexstring
    };

    hexstring = hexstring.replace('#', '');
    if (hexstring.length === 3) {
        hexstring = hexstring[0] + hexstring[0] + hexstring[1] + hexstring[1] + hexstring[2] + hexstring[2];
    }
    if (isNaN(parseFloat(opacity, 10))) {
        opacity = 1;
    }

    hexcolor.r = parseInt(hexstring.substring(0, 2), 16);
    hexcolor.g = parseInt(hexstring.substring(2, 4), 16);
    hexcolor.b = parseInt(hexstring.substring(4, 6), 16);
    hexcolor.a = opacity;
    hexcolor.fillColor = 'rgba(' + hexcolor.r + ',' + hexcolor.g + ',' + hexcolor.b + ',' + hexcolor.a + ')';
    hexcolor.strokeColor = ['rgba(' + parseHalf(hexcolor.r), parseHalf(hexcolor.g), parseHalf(hexcolor.b), hexcolor.a + ')'].join(',');
    hexcolor.rgb = hexcolor.fillColor;
    return hexcolor;
};

var parseHSL = function parseHSL(hslstring, opacity) {
    var hslcolor = {},
        hslparts = compact$2(hslstring.split(/hsla?\(|\,|\)|\%/));

    if (hslparts[3] === undefined) {
        hslparts[3] = 1;
    }
    if (isNaN(parseFloat(opacity, 10))) {
        opacity = 1;
    }

    hslcolor.h = parseFloat(hslparts[0], 10);
    hslcolor.s = parseFloat(hslparts[1], 10);
    hslcolor.l = parseFloat(hslparts[2], 10);
    hslcolor.a = parseFloat(opacity * hslparts[3], 10);

    hslcolor.fillColor = 'hsla(' + hslcolor.h + ',' + hslcolor.s + '%,' + hslcolor.l + '%,' + hslcolor.a + ')';
    hslcolor.strokeColor = 'hsla(' + hslcolor.h + ',' + hslcolor.s + '%,' + parseInt(hslcolor.l / 2, 10) + '%,' + hslcolor.a + ')';
    hslcolor.hsl = hslcolor.fillColor;
    return hslcolor;
};

var parseRGB = function parseRGB(rgbstring, opacity) {
    var rgbcolor = {},
        rgbparts = compact$2(rgbstring.split(/rgba?\(|\,|\)/));

    if (rgbparts[3] === undefined) {
        rgbparts[3] = 1;
    }

    if (isNaN(parseFloat(opacity, 10))) {
        opacity = 1;
    }

    rgbcolor.r = parseInt(rgbparts[0], 10) % 256;
    rgbcolor.g = parseInt(rgbparts[1], 10) % 256;
    rgbcolor.b = parseInt(rgbparts[2], 10) % 256;
    rgbcolor.a = parseFloat(opacity * rgbparts[3], 10);
    rgbcolor.fillColor = 'rgba(' + rgbcolor.r + ',' + rgbcolor.g + ',' + rgbcolor.b + ',' + rgbcolor.a + ')';
    rgbcolor.strokeColor = 'rgba(' + rgbcolor.r / 2 + ',' + rgbcolor.g / 2 + ',' + rgbcolor.b / 2 + ',' + rgbcolor.a + ')';
    rgbcolor.rgb = rgbcolor.fillColor;
    return rgbcolor;
};

var rgbToHSL = function rgbToHSL(r, g, b, a) {
    r = r % 256 / 255;
    g = g % 256 / 255;
    b = b % 256 / 255;
    if (a === undefined) {
        a = 1;
    }
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            default:
                h = 0;
                break;
        }

        h /= 6;
    }
    var hsl = {
        h: Math.round(360 * h),
        s: Math.round(100 * s),
        l: Math.round(100 * l),
        a: Math.round(100 * a) / 100
    };

    hsl.fillColor = 'hsla(' + hsl.h + ',' + hsl.s + '%,' + hsl.l + '%,' + hsl.a + ')';

    return hsl;
};

var hslToRGB = function hslToRGB(h, s, l, a) {
    var r, g, b;

    h = parseFloat(h, 10) / 360;
    s = parseFloat(s, 10) / 100;
    l = parseFloat(l, 10) / 100;
    if (a === undefined) {
        a = 1;
    }
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) {
                t += 1;
            }
            if (t > 1) {
                t -= 1;
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
            }
            if (t < 1 / 2) {
                return q;
            }
            if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6;
            }
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    if (a === undefined) {
        a = 1;
    }

    var rgb = {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
        a: parseFloat(a, 10)
    };

    rgb.fillColor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';

    return rgb;
};

var toDecColor = function toDecColor(stringcolor) {
    var parsedcolor = {};
    if (!stringcolor) {
        parsedcolor.fillColor = 'rgba(100,250,50,0.99)';
    } else if (stringcolor.indexOf('rgb') !== -1) {
        parsedcolor = parseRGB(stringcolor);
    } else if (stringcolor.indexOf('hsl') !== -1) {
        parsedcolor = parseHSL(stringcolor);
    } else {
        parsedcolor = parseHex(stringcolor);
    }

    return parsedcolor;
};

var createTextMarker = function createTextMarker(theoptions) {

    var generateCanvas = function generateCanvas(options) {
        var canvas = document.createElement("canvas");
        var ancho = 30,
            alto = 40;
        canvas.width = ancho + 18;
        canvas.height = alto;
        var x = canvas.width / 2,
            y = canvas.height - 2,
            radius = ancho / 2,
            angulo = 0.6;

        var font = "'" + options.font + "'" || 'Arial';
        var fontsize = options.fontsize || 11;

        var context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        var radius0 = 2 * radius,
            cx = x + 0.95 * radius0,
            cy = y + 0.45 * radius0;

        var grad = context.createLinearGradient(0, 0, 0, canvas.height),
            color0,
            color1;
        if (options.index !== undefined && options.count > 0) {
            color0 = getColor(options.index, options.count);
            color1 = getColor1();
        } else {
            var deccolor = toDecColor(options.color);
            color0 = deccolor.fillColor;
            color1 = darken(deccolor).fillColor;
        }

        grad.addColorStop(0, color0);
        grad.addColorStop(1, color1);

        context.fillStyle = grad;
        context.strokeStyle = 'rgba(200,200,200,0.7)';

        context.beginPath();

        //arco izquierdo
        context.arc(cx - 1, cy, radius0, 9 * Math.PI / 8, -6 * Math.PI / 8, false);

        // arco superior
        context.arc(x, (y - 7) / 2, radius, angulo, Math.PI - angulo, true);

        //arco derecho
        context.arc(2 * x - cx + 1, cy, radius0, -0.95 * Math.PI / 3, -Math.PI / 8, false);
        context.fill();
        context.stroke();

        context.beginPath();
        context.arc(x, 0.40 * y, 2 * radius / 3, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.fill();

        context.beginPath();

        // Render Label
        //context.font = "11pt Arial";
        context.font = fontsize + "pt " + font;
        context.textBaseline = "top";

        var textWidth = context.measureText(options.label);

        if (textWidth.width > ancho || String(options.label).length > 3) {
            context.rect(x - 2 - textWidth.width / 2, y - 30, x - 2 + textWidth.width / 2, y - 23);
            context.fillStyle = '#F7F0F0';
            context.fill();
            context.stroke();
        }

        context.fillStyle = "black";
        context.strokeStyle = "black";
        // centre the text.
        context.fillText(options.label, 1 + Math.floor(canvas.width / 2 - textWidth.width / 2), 8);

        return canvas;
    };
    theoptions.scale = theoptions.scale || 0.75;
    var markerCanvas = generateCanvas(theoptions);

    var iconObj = {
        url: markerCanvas.toDataURL()
    };
    if (window.google && window.google.maps) {
        Object.assign(iconObj, {
            size: new google.maps.Size(48, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(24 * theoptions.scale, 40 * theoptions.scale),
            scaledSize: new google.maps.Size(48 * theoptions.scale, 40 * theoptions.scale)
        });
    }

    return iconObj;
};

var createFatMarkerIcon = function createFatMarkerIcon(theoptions) {

    var generateFatCanvas = function generateFatCanvas(options) {
        var canvas = options.canvas || document.createElement("canvas"),
            anchorX = 27,
            anchorY = 53,
            radius = anchorX - 9,
            angulo = 1.1,
            font = options.font || 'fontello',
            fontsize = options.fontsize || 14,
            context = canvas.getContext("2d"),
            grad = context.createLinearGradient(0, 0, 0, anchorY),
            color0,
            color1;

        canvas.width = anchorX * 2;
        canvas.height = anchorY + 1;

        if (options.index !== undefined && options.count > 0) {
            color0 = getColor(options.index, options.count);
            color1 = getColor1();
        } else {
            var deccolor = toDecColor(options.color);
            color0 = deccolor.fillColor;
            color1 = darken(deccolor).fillColor;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        grad.addColorStop(0, color0);
        grad.addColorStop(1, color1);

        context.fillStyle = grad;
        context.strokeStyle = color1;
        context.beginPath();

        context.moveTo(anchorX, anchorY);

        // arco superior
        context.arc(anchorX, 2 + 0.50 * anchorY, radius, angulo, Math.PI - angulo, true);

        //punta inferior
        context.lineTo(anchorX, anchorY);

        context.fill();
        context.stroke();

        // Círculo blanco
        context.beginPath();
        context.arc(anchorX, 2 + 0.50 * anchorY, radius - 3, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.fill();

        context.beginPath();

        context.font = 'normal normal normal ' + fontsize + 'px ' + font;
        console.log('context font', context.font);
        context.fillStyle = color1;
        context.textBaseline = "top";
        var textWidth = context.measureText(options.unicodelabel);

        // centre the text.
        context.fillText(options.unicodelabel, Math.floor(canvas.width / 2 - textWidth.width / 2), 1 + Math.floor(canvas.height / 2 - fontsize / 2));

        return canvas;
    };
    var scale = theoptions.scale || 1,
        markerCanvas = generateFatCanvas(theoptions);

    var iconObj = {
        url: markerCanvas.toDataURL(),
        scale: scale
    };
    if (window.google && window.google.maps) {
        Object.assign(iconObj, {
            size: new google.maps.Size(54, 48),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(21 * scale, 36 * scale),
            scaledSize: new google.maps.Size(42 * scale, 36 * scale)
        });
    }
    return iconObj;
};

var createTransparentMarkerIcon = function createTransparentMarkerIcon(theoptions) {

    var generateTransparentCanvas = function generateTransparentCanvas(options) {
        var canvas = options.canvas || document.createElement("canvas"),
            context = canvas.getContext("2d"),
            font = options.font || 'fontello',
            fontsize = options.fontsize || 30,
            color0,
            color1;

        canvas.width = 54;
        canvas.height = 48;
        context.clearRect(0, 0, canvas.width, canvas.height);

        /*context.rect(1, 1, canvas.width - 2, canvas.height - 2);
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.stroke();*/

        if (options.index !== undefined && options.count > 0) {
            color0 = getColor(options.index, options.count);
            color1 = getColor1();
        } else {
            var deccolor = toDecColor(options.color);
            color0 = deccolor.fillColor;
            color1 = darken(deccolor).fillColor;
        }

        context.beginPath();

        context.font = 'normal normal normal ' + fontsize + 'px ' + font;

        context.textBaseline = "top";
        var textWidth = context.measureText(options.unicodelabel),
            text_x = Math.floor(canvas.width / 2 - textWidth.width / 2);

        if (options.shadow) {
            var grad = context.createLinearGradient(text_x, 0, canvas.width, canvas.height);

            grad.addColorStop(0, '#FFFFFF');
            grad.addColorStop(1, color0);

            //console.debug('applying shadow');
            context.shadowOffsetX = -2;
            context.shadowOffsetY = -2;
            context.shadowBlur = 0;

            context.fillStyle = '#FFFFFF';
            context.shadowColor = '#666666';

            context.fillText(options.unicodelabel, text_x - 4, 0);
            context.fillText(options.unicodelabel, text_x, 3);
            context.fillStyle = grad;
            context.fillText(options.unicodelabel, text_x + 4, 6);

            context.strokeStyle = '#FFFFFF';
            context.strokeText(options.unicodelabel, text_x + 4, 6);
        } else {

            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowBlur = 0;
            context.shadowColor = '#FFFFFF';
            context.fillStyle = color0;
            context.fillText(options.unicodelabel, text_x + 1, 0);

            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowBlur = 1;
            context.shadowColor = '#FFFFFF';
            context.strokeStyle = color1;
            context.strokeText(options.unicodelabel, text_x + 1, 0);
        }

        canvas.fillColor = color0;

        return canvas;
    };

    theoptions.scale = theoptions.scale || 1;
    theoptions.fontsize = theoptions.fontsize || 30;

    var markerCanvas = generateTransparentCanvas(theoptions);

    var scale = theoptions.scale;
    if (theoptions.shadow) {
        scale = 0.9 * scale;
    }
    var iconObj = {
        canvas: markerCanvas,
        url: markerCanvas.toDataURL(),
        fillColor: markerCanvas.fillColor
    };

    Object.assign(iconObj, theoptions);

    if (window.google && window.google.maps) {
        Object.assign(iconObj, {
            size: new google.maps.Size(54 * scale, 48 * scale),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(27 * scale, 24 * scale),
            scaledSize: new google.maps.Size(54 * scale, 48 * scale)
        });
    }
    //console.debug('createTransparentMarkerIcon', iconObj);

    return iconObj;
};

function parseColorString(somecolor, opacity) {
    var parsedcolor = {
        original: somecolor
    },
        hsl,
        rgb;

    opacity = opacity || 1;

    if (somecolor.indexOf('hsl') !== -1) {
        hsl = parseHSL(somecolor, opacity);
        rgb = hslToRGB(hsl.h, hsl.s, hsl.l, hsl.a);
    } else {
        if (somecolor.indexOf('rgb') !== -1) {
            rgb = parseRGB(somecolor, opacity);
        } else {
            rgb = parseHex(somecolor, opacity);
        }
        hsl = rgbToHSL(rgb.r, rgb.g, rgb.b, rgb.a);
    }

    parsedcolor.hsl = {
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
        a: hsl.a
    };
    parsedcolor.rgb = {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        a: rgb.a
    };

    parsedcolor.fillColor = rgb.fillColor;
    parsedcolor.strokeColor = rgb.strokeColor;
    parsedcolor.hex = ['#', rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)].join('');
    return parsedcolor;
}

var getHexColor = function getHexColor(color) {
    var hexcolor = color;
    if (color.indexOf('rgb') !== -1) {
        var rgbArr = color.split(/[\(,\)]/ig);
        hexcolor = [(1 * rgbArr[1]).toString(16), (1 * rgbArr[2]).toString(16), (1 * rgbArr[3]).toString(16)].join('');
    } else if (color.indexOf('#') !== -1) {
        hexcolor = color.replace(/#/g, '');
    }
    return hexcolor;
};

var ButtonFactory = {
    parseColorString: parseColorString,
    autoIcon: function autoIcon(options) {
        options.font = options.font || 'Arial';
        options.color = options.color || '#FF0000';
        options.hexcolor = getHexColor(options.color);

        // En frontdev el icono debe aparecer solo, sin envoltorio
        if (options.transparent_background === undefined) {
            options.transparent_background = true;
        }
        if (options.font === 'fontawesome-webfont' || options.font === 'fontello' || options.font === 'Material Icons' || options.font === 'Material-Design-Icons') {

            // Fontello obligatorio
            options.font = 'fontello';

            options.label = (options.label || 'e836').slice(-4);

            options.unicodelabel = String.fromCharCode('0x' + options.label);
            options.scale = options.scale || 1;
            if (options.transparent_background) {
                return createTransparentMarkerIcon(options);
            } else {
                return createFatMarkerIcon(options);
            }
        } else {
            options.scale = options.scale || 0.75;
            options.label = String(options.label || 'A');
            // This is text I should print literally
            return createTextMarker(options);
        }
    }
};

/** @license
 *
 *  Copyright (C) 2012 K. Arthur Endsley (kaendsle@mtu.edu)
 *  Michigan Tech Research Institute (MTRI)
 *  3600 Green Court, Suite 100, Ann Arbor, MI, 48105
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var beginsWith;
var endsWith;

/**
 * @desc The Wkt namespace.
 * @property    {String}    delimiter   - The default delimiter for separating components of atomic geometry (coordinates)
 * @namespace
 * @global
 */
var Wkt = function Wkt(obj) {
	if (obj instanceof Wkt) return obj;
	if (!(this instanceof Wkt)) return new Wkt(obj);
	this._wrapped = obj;
};

/**
 * Returns true if the substring is found at the beginning of the string.
 * @param   str {String}    The String to search
 * @param   sub {String}    The substring of interest
 * @return      {Boolean}
 * @private
 */
beginsWith = function beginsWith(str, sub) {
	return str.substring(0, sub.length) === sub;
};

/**
 * Returns true if the substring is found at the end of the string.
 * @param   str {String}    The String to search
 * @param   sub {String}    The substring of interest
 * @return      {Boolean}
 * @private
 */
endsWith = function endsWith(str, sub) {
	return str.substring(str.length - sub.length) === sub;
};

/**
 * The default delimiter for separating components of atomic geometry (coordinates)
 * @ignore
 */
Wkt.delimiter = ' ';

/**
 * Determines whether or not the passed Object is an Array.
 * @param   obj {Object}    The Object in question
 * @return      {Boolean}
 * @member Wkt.isArray
 * @method
 */
Wkt.isArray = function (obj) {
	return !!(obj && obj.constructor === Array);
};

/**
 * Removes given character String(s) from a String.
 * @param   str {String}    The String to search
 * @param   sub {String}    The String character(s) to trim
 * @return      {String}    The trimmed string
 * @member Wkt.trim
 * @method
 */
Wkt.trim = function (str, sub) {
	sub = sub || ' '; // Defaults to trimming spaces
	// Trim beginning spaces
	while (beginsWith(str, sub)) {
		str = str.substring(1);
	}
	// Trim ending spaces
	while (endsWith(str, sub)) {
		str = str.substring(0, str.length - 1);
	}
	return str;
};

/**
 * An object for reading WKT strings and writing geographic features
 * @constructor this.Wkt.Wkt
 * @param   initializer {String}    An optional WKT string for immediate read
 * @property            {Array}     components      - Holder for atomic geometry objects (internal representation of geometric components)
 * @property            {String}    delimiter       - The default delimiter for separating components of atomic geometry (coordinates)
 * @property            {Object}    regExes         - Some regular expressions copied from OpenLayers.Format.WKT.js
 * @property            {String}    type            - The Well-Known Text name (e.g. 'point') of the geometry
 * @property            {Boolean}   wrapVerticies   - True to wrap vertices in MULTIPOINT geometries; If true: MULTIPOINT((30 10),(10 30),(40 40)); If false: MULTIPOINT(30 10,10 30,40 40)
 * @return              {this.Wkt.Wkt}
 * @memberof Wkt
 */
Wkt.Wkt = function (initializer) {

	/**
  * The default delimiter between X and Y coordinates.
  * @ignore
  */
	this.delimiter = Wkt.delimiter || ' ';

	/**
  * Configuration parameter for controlling how Wicket seralizes
  * MULTIPOINT strings. Examples; both are valid WKT:
  * If true: MULTIPOINT((30 10),(10 30),(40 40))
  * If false: MULTIPOINT(30 10,10 30,40 40)
  * @ignore
  */
	this.wrapVertices = true;

	/**
  * Some regular expressions copied from OpenLayers.Format.WKT.js
  * @ignore
  */
	this.regExes = {
		'typeStr': /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
		'spaces': /\s+|\+/, // Matches the '+' or the empty space
		'numeric': /-*\d+(\.*\d+)?/,
		'comma': /\s*,\s*/,
		'parenComma': /\)\s*,\s*\(/,
		'coord': /-*\d+\.*\d+ -*\d+\.*\d+/, // e.g. "24 -14"
		'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/,
		'trimParens': /^\s*\(?(.*?)\)?\s*$/,
		'ogcTypes': /^(multi)?(point|line|polygon|box)?(string)?$/i, // Captures e.g. "Multi","Line","String"
		'crudeJson': /^{.*"(type|coordinates|geometries|features)":.*}$/ // Attempts to recognize JSON strings
	};

	/**
  * The internal representation of geometry--the "components" of geometry.
  * @ignore
  */
	this.components = undefined;

	// An initial WKT string may be provided
	if (initializer && typeof initializer === 'string') {
		this.read(initializer);
	} else if (initializer && typeof initializer !== undefined) {
		this.fromObject(initializer);
	}
};

/**
 * Returns true if the internal geometry is a collection of geometries.
 * @return  {Boolean}   Returns true when it is a collection
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.isCollection = function () {
	switch (this.type.slice(0, 5)) {
		case 'multi':
			// Trivial; any multi-geometry is a collection
			return true;
		case 'polyg':
			// Polygons with holes are "collections" of rings
			return true;
		default:
			// Any other geometry is not a collection
			return false;
	}
};

/**
 * Compares two x,y coordinates for equality.
 * @param   a   {Object}    An object with x and y properties
 * @param   b   {Object}    An object with x and y properties
 * @return      {Boolean}
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.sameCoords = function (a, b) {
	return a.x === b.x && a.y === b.y;
};

/**
 * Sets internal geometry (components) from framework geometry (e.g.
 * Google Polygon objects or google.maps.Polygon).
 * @param   obj {Object}    The framework-dependent geometry representation
 * @return      {this.Wkt.Wkt}   The object itself
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.fromObject = function (obj) {
	var result;

	if (obj.hasOwnProperty('type') && obj.hasOwnProperty('coordinates')) {
		result = this.fromJson(obj);
	} else {
		result = this.deconstruct.call(this, obj);
	}

	this.components = result.components;
	this.isRectangle = result.isRectangle || false;
	this.type = result.type;
	return this;
};

/**
 * Creates external geometry objects based on a plug-in framework's
 * construction methods and available geometry classes.
 * @param   config  {Object}    An optional framework-dependent properties specification
 * @return          {Object}    The framework-dependent geometry representation
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.toObject = function (config) {
	var obj = this.construct[this.type].call(this, config);
	// Don't assign the "properties" property to an Array
	if (typeof obj === 'object' && !Wkt.isArray(obj)) {
		obj.properties = this.properties;
	}
	return obj;
};

/**
 * Returns the WKT string representation; the same as the write() method.
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.toString = function (config) {
	return this.write();
};

/**
 * Parses a JSON representation as an Object.
 * @param	obj	{Object}	An Object with the GeoJSON schema
 * @return	{this.Wkt.Wkt}	The object itself
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.fromJson = function (obj) {
	var i, j, k, coords, iring, oring;

	this.type = obj.type.toLowerCase();
	this.components = [];
	if (obj.hasOwnProperty('geometry')) {
		//Feature
		this.fromJson(obj.geometry);
		this.properties = obj.properties;
		return this;
	}
	coords = obj.coordinates;

	if (!Wkt.isArray(coords[0])) {
		// Point
		this.components.push({
			x: coords[0],
			y: coords[1]
		});
	} else {

		for (i in coords) {
			if (coords.hasOwnProperty(i)) {

				if (!Wkt.isArray(coords[i][0])) {
					// LineString

					if (this.type === 'multipoint') {
						// MultiPoint
						this.components.push([{
							x: coords[i][0],
							y: coords[i][1]
						}]);
					} else {
						this.components.push({
							x: coords[i][0],
							y: coords[i][1]
						});
					}
				} else {

					oring = [];
					for (j in coords[i]) {
						if (coords[i].hasOwnProperty(j)) {

							if (!Wkt.isArray(coords[i][j][0])) {
								oring.push({
									x: coords[i][j][0],
									y: coords[i][j][1]
								});
							} else {

								iring = [];
								for (k in coords[i][j]) {
									if (coords[i][j].hasOwnProperty(k)) {

										iring.push({
											x: coords[i][j][k][0],
											y: coords[i][j][k][1]
										});
									}
								}

								oring.push(iring);
							}
						}
					}

					this.components.push(oring);
				}
			}
		}
	}

	return this;
};

/**
 * Creates a JSON representation, with the GeoJSON schema, of the geometry.
 * @return    {Object}    The corresponding GeoJSON representation
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.toJson = function () {
	var cs, json, i, j, k, ring, rings;

	cs = this.components;
	json = {
		coordinates: [],
		type: function () {
			var i, type, s;

			type = this.regExes.ogcTypes.exec(this.type).slice(1);
			s = [];

			for (i in type) {
				if (type.hasOwnProperty(i)) {
					if (type[i] !== undefined) {
						s.push(type[i].toLowerCase().slice(0, 1).toUpperCase() + type[i].toLowerCase().slice(1));
					}
				}
			}

			return s;
		}.call(this).join('')
	};

	// Wkt BOX type gets a special bbox property in GeoJSON
	if (this.type.toLowerCase() === 'box') {
		json.type = 'Polygon';
		json.bbox = [];

		for (i in cs) {
			if (cs.hasOwnProperty(i)) {
				json.bbox = json.bbox.concat([cs[i].x, cs[i].y]);
			}
		}

		json.coordinates = [[[cs[0].x, cs[0].y], [cs[0].x, cs[1].y], [cs[1].x, cs[1].y], [cs[1].x, cs[0].y], [cs[0].x, cs[0].y]]];

		return json;
	}

	// For the coordinates of most simple features
	for (i in cs) {
		if (cs.hasOwnProperty(i)) {

			// For those nested structures
			if (Wkt.isArray(cs[i])) {
				rings = [];

				for (j in cs[i]) {
					if (cs[i].hasOwnProperty(j)) {

						if (Wkt.isArray(cs[i][j])) {
							// MULTIPOLYGONS
							ring = [];

							for (k in cs[i][j]) {
								if (cs[i][j].hasOwnProperty(k)) {
									ring.push([cs[i][j][k].x, cs[i][j][k].y]);
								}
							}

							rings.push(ring);
						} else {
							// POLYGONS and MULTILINESTRINGS

							if (cs[i].length > 1) {
								rings.push([cs[i][j].x, cs[i][j].y]);
							} else {
								// MULTIPOINTS
								rings = rings.concat([cs[i][j].x, cs[i][j].y]);
							}
						}
					}
				}

				json.coordinates.push(rings);
			} else {
				if (cs.length > 1) {
					// For LINESTRING type
					json.coordinates.push([cs[i].x, cs[i].y]);
				} else {
					// For POINT type
					json.coordinates = json.coordinates.concat([cs[i].x, cs[i].y]);
				}
			}
		}
	}

	return json;
};

/**
 * Absorbs the geometry of another this.Wkt.Wkt instance, merging it with its own,
 * creating a collection (MULTI-geometry) based on their types, which must agree.
 * For example, creates a MULTIPOLYGON from a POLYGON type merged with another
 * POLYGON type, or adds a POLYGON instance to a MULTIPOLYGON instance.
 * @param   wkt {String}    A Wkt.Wkt object
 * @return	{this.Wkt.Wkt}	The object itself
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.merge = function (wkt) {
	var prefix = this.type.slice(0, 5);

	if (this.type !== wkt.type) {
		if (this.type.slice(5, this.type.length) !== wkt.type) {
			throw TypeError('The input geometry types must agree or the calling this.Wkt.Wkt instance must be a multigeometry of the other');
		}
	}

	switch (prefix) {

		case 'point':
			this.components = [this.components.concat(wkt.components)];
			break;

		case 'multi':
			this.components = this.components.concat(wkt.type.slice(0, 5) === 'multi' ? wkt.components : [wkt.components]);
			break;

		default:
			this.components = [this.components, wkt.components];
			break;

	}

	if (prefix !== 'multi') {
		this.type = 'multi' + this.type;
	}
	return this;
};

/**
 * Reads a WKT string, validating and incorporating it.
 * @param   str {String}    A WKT or GeoJSON string
 * @return	{this.Wkt.Wkt}	The object itself
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.read = function (str) {
	var matches;
	matches = this.regExes.typeStr.exec(str);
	if (matches) {
		this.type = matches[1].toLowerCase();
		this.base = matches[2];
		if (this.ingest[this.type]) {
			this.components = this.ingest[this.type].apply(this, [this.base]);
		}
	} else {
		if (this.regExes.crudeJson.test(str)) {
			if (typeof JSON === 'object' && typeof JSON.parse === 'function') {
				this.fromJson(JSON.parse(str));
			} else {
				console.log('JSON.parse() is not available; cannot parse GeoJSON strings');
				throw {
					name: 'JSONError',
					message: 'JSON.parse() is not available; cannot parse GeoJSON strings'
				};
			}
		} else {
			console.log('Invalid WKT string provided to read()');
			throw {
				name: 'WKTError',
				message: 'Invalid WKT string provided to read()'
			};
		}
	}

	return this;
}; // eo readWkt

/**
 * Writes a WKT string.
 * @param   components  {Array}     An Array of internal geometry objects
 * @return              {String}    The corresponding WKT representation
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.write = function (components) {
	var i, pieces, data;

	components = components || this.components;

	pieces = [];

	pieces.push(this.type.toUpperCase() + '(');

	for (i = 0; i < components.length; i += 1) {
		if (this.isCollection() && i > 0) {
			pieces.push(',');
		}

		// There should be an extract function for the named type
		if (!this.extract[this.type]) {
			return null;
		}

		data = this.extract[this.type].apply(this, [components[i]]);
		if (this.isCollection() && this.type !== 'multipoint') {
			pieces.push('(' + data + ')');
		} else {
			pieces.push(data);

			// If not at the end of the components, add a comma
			if (i !== components.length - 1 && this.type !== 'multipoint') {
				pieces.push(',');
			}
		}
	}

	pieces.push(')');

	return pieces.join('');
};

/**
 * This object contains functions as property names that extract WKT
 * strings from the internal representation.
 * @memberof this.Wkt.Wkt
 * @namespace this.Wkt.Wkt.extract
 * @instance
 */
Wkt.Wkt.prototype.extract = {
	/**
  * Return a WKT string representing atomic (point) geometry
  * @param   point   {Object}    An object with x and y properties
  * @return          {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	point: function point(_point) {
		return String(_point.x) + this.delimiter + String(_point.y);
	},

	/**
  * Return a WKT string representing multiple atoms (points)
  * @param   multipoint  {Array}     Multiple x-and-y objects
  * @return              {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	multipoint: function multipoint(_multipoint) {
		var i,
		    parts = [],
		    s;

		for (i = 0; i < _multipoint.length; i += 1) {
			s = this.extract.point.apply(this, [_multipoint[i]]);

			if (this.wrapVertices) {
				s = '(' + s + ')';
			}

			parts.push(s);
		}

		return parts.join(',');
	},

	/**
  * Return a WKT string representing a chain (linestring) of atoms
  * @param   linestring  {Array}     Multiple x-and-y objects
  * @return              {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	linestring: function linestring(_linestring) {
		// Extraction of linestrings is the same as for points
		return this.extract.point.apply(this, [_linestring]);
	},

	/**
  * Return a WKT string representing multiple chains (multilinestring) of atoms
  * @param   multilinestring {Array}     Multiple of multiple x-and-y objects
  * @return                  {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	multilinestring: function multilinestring(_multilinestring) {
		var i,
		    parts = [];

		if (_multilinestring.length) {
			for (i = 0; i < _multilinestring.length; i += 1) {
				parts.push(this.extract.linestring.apply(this, [_multilinestring[i]]));
			}
		} else {
			parts.push(this.extract.point.apply(this, [_multilinestring]));
		}

		return parts.join(',');
	},

	/**
  * Return a WKT string representing multiple atoms in closed series (polygon)
  * @param   polygon {Array}     Collection of ordered x-and-y objects
  * @return          {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	polygon: function polygon(_polygon) {
		// Extraction of polygons is the same as for multilinestrings
		return this.extract.multilinestring.apply(this, [_polygon]);
	},

	/**
  * Return a WKT string representing multiple closed series (multipolygons) of multiple atoms
  * @param   multipolygon    {Array}     Collection of ordered x-and-y objects
  * @return                  {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	multipolygon: function multipolygon(_multipolygon) {
		var i,
		    parts = [];
		for (i = 0; i < _multipolygon.length; i += 1) {
			parts.push('(' + this.extract.polygon.apply(this, [_multipolygon[i]]) + ')');
		}
		return parts.join(',');
	},

	/**
  * Return a WKT string representing a 2DBox
  * @param   multipolygon    {Array}     Collection of ordered x-and-y objects
  * @return                  {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	box: function box(_box) {
		return this.extract.linestring.apply(this, [_box]);
	},

	geometrycollection: function geometrycollection(str) {
		console.log('The geometrycollection WKT type is not yet supported.');
	}
};

/**
 * This object contains functions as property names that ingest WKT
 * strings into the internal representation.
 * @memberof this.Wkt.Wkt
 * @namespace this.Wkt.Wkt.ingest
 * @instance
 */
Wkt.Wkt.prototype.ingest = {

	/**
  * Return point feature given a point WKT fragment.
  * @param   str {String}    A WKT fragment representing the point
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	point: function point(str) {
		var coords = Wkt.trim(str).split(this.regExes.spaces);
		// In case a parenthetical group of coordinates is passed...
		return [{ // ...Search for numeric substrings
			x: parseFloat(this.regExes.numeric.exec(coords[0])[0]),
			y: parseFloat(this.regExes.numeric.exec(coords[1])[0])
		}];
	},

	/**
  * Return a multipoint feature given a multipoint WKT fragment.
  * @param   str {String}    A WKT fragment representing the multipoint
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	multipoint: function multipoint(str) {
		var i, components, points;
		components = [];
		points = Wkt.trim(str).split(this.regExes.comma);
		for (i = 0; i < points.length; i += 1) {
			components.push(this.ingest.point.apply(this, [points[i]]));
		}
		return components;
	},

	/**
  * Return a linestring feature given a linestring WKT fragment.
  * @param   str {String}    A WKT fragment representing the linestring
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	linestring: function linestring(str) {
		var i, multipoints, components;

		// In our x-and-y representation of components, parsing
		//  multipoints is the same as parsing linestrings
		multipoints = this.ingest.multipoint.apply(this, [str]);

		// However, the points need to be joined
		components = [];
		for (i = 0; i < multipoints.length; i += 1) {
			components = components.concat(multipoints[i]);
		}
		return components;
	},

	/**
  * Return a multilinestring feature given a multilinestring WKT fragment.
  * @param   str {String}    A WKT fragment representing the multilinestring
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	multilinestring: function multilinestring(str) {
		var i, components, line, lines;
		components = [];

		lines = Wkt.trim(str).split(this.regExes.doubleParenComma);
		if (lines.length === 1) {
			// If that didn't work...
			lines = Wkt.trim(str).split(this.regExes.parenComma);
		}

		for (i = 0; i < lines.length; i += 1) {
			line = lines[i].replace(this.regExes.trimParens, '$1');
			components.push(this.ingest.linestring.apply(this, [line]));
		}

		return components;
	},

	/**
  * Return a polygon feature given a polygon WKT fragment.
  * @param   str {String}    A WKT fragment representing the polygon
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	polygon: function polygon(str) {
		var i, j, components, subcomponents, ring, rings;
		rings = Wkt.trim(str).split(this.regExes.parenComma);
		components = []; // Holds one or more rings
		for (i = 0; i < rings.length; i += 1) {
			ring = rings[i].replace(this.regExes.trimParens, '$1').split(this.regExes.comma);
			subcomponents = []; // Holds the outer ring and any inner rings (holes)
			for (j = 0; j < ring.length; j += 1) {
				// Split on the empty space or '+' character (between coordinates)
				var split = ring[j].split(this.regExes.spaces);
				if (split.length > 2) {
					//remove the elements which are blanks
					split = split.filter(function (n) {
						return n != "";
					});
				}
				if (split.length === 2) {
					var x_cord = split[0];
					var y_cord = split[1];

					//now push
					subcomponents.push({
						x: parseFloat(x_cord),
						y: parseFloat(y_cord)
					});
				}
			}
			components.push(subcomponents);
		}
		return components;
	},

	/**
  * Return box vertices (which would become the Rectangle bounds) given a Box WKT fragment.
  * @param   str {String}    A WKT fragment representing the box
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	box: function box(str) {
		var i, multipoints, components;

		// In our x-and-y representation of components, parsing
		//  multipoints is the same as parsing linestrings
		multipoints = this.ingest.multipoint.apply(this, [str]);

		// However, the points need to be joined
		components = [];
		for (i = 0; i < multipoints.length; i += 1) {
			components = components.concat(multipoints[i]);
		}

		return components;
	},

	/**
  * Return a multipolygon feature given a multipolygon WKT fragment.
  * @param   str {String}    A WKT fragment representing the multipolygon
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	multipolygon: function multipolygon(str) {
		var i, components, polygon, polygons;
		components = [];
		polygons = Wkt.trim(str).split(this.regExes.doubleParenComma);
		for (i = 0; i < polygons.length; i += 1) {
			polygon = polygons[i].replace(this.regExes.trimParens, '$1');
			components.push(this.ingest.polygon.apply(this, [polygon]));
		}
		return components;
	},

	/**
  * Return an array of features given a geometrycollection WKT fragment.
  * @param   str {String}    A WKT fragment representing the geometry collection
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	geometrycollection: function geometrycollection(str) {
		console.log('The geometrycollection WKT type is not yet supported.');
	}

}; // eo ingest

/**
 * @augments Wkt.Wkt
 * A framework-dependent flag, set for each Wkt.Wkt() instance, that indicates
 * whether or not a closed polygon geometry should be interpreted as a rectangle.
 */
Wkt.Wkt.prototype.isRectangle = false;

/**
 * @augments Wkt.Wkt
 * An object of framework-dependent construction methods used to generate
 * objects belonging to the various geometry classes of the framework.
 */
Wkt.Wkt.prototype.construct = {
	/**
  * Creates the framework's equivalent point geometry object.
  * @param   config      {Object}    An optional properties hash the object should use
  * @param   component   {Object}    An optional component to build from
  * @return              {gmaps.Marker}
  */
	point: function point(config, component) {
		var c = component || this.components;

		config = config || {
			optimized: true
		};

		config.position = new gmaps.LatLng(c[0].y, c[0].x);

		return new gmaps.Marker(config);
	},

	/**
  * Creates the framework's equivalent multipoint geometry object.
  * @param   config  {Object}    An optional properties hash the object should use
  * @return          {Array}     Array containing multiple gmaps.Marker
  */
	multipoint: function multipoint(config) {
		var i, c, arr;

		c = this.components;

		config = config || {};

		arr = [];

		for (i = 0; i < c.length; i += 1) {
			arr.push(this.construct.point(config, c[i]));
		}

		return arr;
	},

	/**
  * Creates the framework's equivalent linestring geometry object.
  * @param   config      {Object}    An optional properties hash the object should use
  * @param   component   {Object}    An optional component to build from
  * @return              {gmaps.Polyline}
  */
	linestring: function linestring(config, component) {
		var i, c;

		c = component || this.components;

		config = config || {
			editable: false
		};

		config.path = [];

		for (i = 0; i < c.length; i += 1) {
			config.path.push(new gmaps.LatLng(c[i].y, c[i].x));
		}

		return new gmaps.Polyline(config);
	},

	/**
  * Creates the framework's equivalent multilinestring geometry object.
  * @param   config  {Object}    An optional properties hash the object should use
  * @return          {Array}     Array containing multiple gmaps.Polyline instances
  */
	multilinestring: function multilinestring(config) {
		var i, c, arr;

		c = this.components;

		config = config || {
			editable: false
		};

		config.path = [];

		arr = [];

		for (i = 0; i < c.length; i += 1) {
			arr.push(this.construct.linestring(config, c[i]));
		}

		return arr;
	},

	/**
  * Creates the framework's equivalent Box or Rectangle geometry object.
  * @param   config      {Object}    An optional properties hash the object should use
  * @param   component   {Object}    An optional component to build from
  * @return              {gmaps.Rectangle}
  */
	box: function box(config, component) {
		var c = component || this.components;

		config = config || {};

		config.bounds = new gmaps.LatLngBounds(new gmaps.LatLng(c[0].y, c[0].x), new gmaps.LatLng(c[1].y, c[1].x));

		return new gmaps.Rectangle(config);
	},

	/**
  * Creates the framework's equivalent polygon geometry object.
  * @param   config      {Object}    An optional properties hash the object should use
  * @param   component   {Object}    An optional component to build from
  * @return              {gmaps.Polygon}
  */
	polygon: function polygon(config, component) {
		var j, k, c, rings, verts;

		c = component || this.components;

		config = config || {
			editable: false // Editable geometry off by default
		};

		config.paths = [];

		rings = [];
		for (j = 0; j < c.length; j += 1) {
			// For each ring...

			verts = [];
			// NOTE: We iterate to one (1) less than the Array length to skip the last vertex
			for (k = 0; k < c[j].length - 1; k += 1) {
				// For each vertex...
				verts.push(new gmaps.LatLng(c[j][k].y, c[j][k].x));
			} // eo for each vertex

			if (j !== 0) {
				// Reverse the order of coordinates in inner rings
				if (config.reverseInnerPolygons === null || config.reverseInnerPolygons) {
					verts.reverse();
				}
			}

			rings.push(verts);
		} // eo for each ring

		config.paths = config.paths.concat(rings);

		if (this.isRectangle) {
			return function () {
				var bounds, v;

				bounds = new gmaps.LatLngBounds();

				for (v in rings[0]) {
					// Ought to be only 1 ring in a Rectangle
					if (rings[0].hasOwnProperty(v)) {
						bounds.extend(rings[0][v]);
					}
				}

				return new gmaps.Rectangle({
					bounds: bounds
				});
			}();
		} else {
			return new gmaps.Polygon(config);
		}
	},

	/**
  * Creates the framework's equivalent multipolygon geometry object.
  * @param   config  {Object}    An optional properties hash the object should use
  * @return          {Array}     Array containing multiple gmaps.Polygon
  */
	multipolygon: function multipolygon(config) {
		var i, c, arr;

		c = this.components;

		config = config || {
			editable: false
		};

		config.path = [];

		arr = [];

		for (i = 0; i < c.length; i += 1) {
			arr.push(this.construct.polygon(config, c[i]));
		}

		return arr;
	}

};

/**
 * @augments Wkt.Wkt
 * A framework-dependent deconstruction method used to generate internal
 * geometric representations from instances of framework geometry. This method
 * uses object detection to attempt to classify members of framework geometry
 * classes into the standard WKT types.
 * @param obj       {Object}    An instance of one of the framework's geometry classes
 * @param multiFlag {Boolean} If true, then the deconstructor will be forced to return a MultiGeometry (multipoint, multilinestring or multipolygon)
 * @return          {Object}    A hash of the 'type' and 'components' thus derived, plus the WKT string of the feature.
 */
Wkt.Wkt.prototype.deconstruct = function (obj, multiFlag) {
	var features, i, j, verts, rings, sign, tmp, response, lat, lng, vertex, ring;
	var polygons, polygon, k, linestring, linestrings;
	// Shortcut to signed area function (determines clockwise vs counter-clock)
	if (gmaps.geometry) {
		sign = gmaps.geometry.spherical.computeSignedArea;
	}

	// gmaps.LatLng //////////////////////////////////////////////////////
	if (obj.constructor === gmaps.LatLng) {

		response = {
			type: 'point',
			components: [{
				x: obj.lng(),
				y: obj.lat()
			}]
		};
		return response;
	}

	// gmaps.Point //////////////////////////////////////////////////////
	if (obj.constructor === gmaps.Point) {
		response = {
			type: 'point',
			components: [{
				x: obj.x,
				y: obj.y
			}]
		};
		return response;
	}

	// gmaps.Marker //////////////////////////////////////////////////////
	if (obj.constructor === gmaps.Marker) {
		response = {
			type: 'point',
			components: [{
				x: obj.getPosition().lng(),
				y: obj.getPosition().lat()
			}]
		};
		return response;
	}

	// gmaps.Polyline ////////////////////////////////////////////////////
	if (obj.constructor === gmaps.Polyline) {

		verts = [];
		for (i = 0; i < obj.getPath().length; i += 1) {
			tmp = obj.getPath().getAt(i);
			verts.push({
				x: tmp.lng(),
				y: tmp.lat()
			});
		}
		response = {
			type: 'linestring',
			components: verts
		};
		return response;
	}

	// gmaps.Polygon /////////////////////////////////////////////////////
	if (obj.constructor === gmaps.Polygon) {

		rings = [];

		if (multiFlag === undefined) {
			multiFlag = function () {
				var areas, l;

				l = obj.getPaths().length;
				if (l <= 1) {
					// Trivial; this is a single polygon
					return false;
				}

				if (l === 2) {
					// If clockwise*clockwise or counter*counter, i.e.
					//  (-1)*(-1) or (1)*(1), then result would be positive
					if (sign(obj.getPaths().getAt(0)) * sign(obj.getPaths().getAt(1)) < 0) {
						return false; // Most likely single polygon with 1 hole
					}

					return true;
				}

				// Must be longer than 3 polygons at this point...
				areas = obj.getPaths().getArray().map(function (k) {
					return sign(k) / Math.abs(sign(k)); // Unit normalization (outputs 1 or -1)
				});

				// If two clockwise or two counter-clockwise rings are found
				//  (at different indices)...
				if (areas.indexOf(areas[0]) !== areas.lastIndexOf(areas[0])) {
					multiFlag = true; // Flag for holes in one or more polygons
					return true;
				}

				return false;
			}();
		}

		for (i = 0; i < obj.getPaths().length; i += 1) {
			// For each polygon (ring)...
			tmp = obj.getPaths().getAt(i);
			verts = [];
			for (j = 0; j < obj.getPaths().getAt(i).length; j += 1) {
				// For each vertex...
				verts.push({
					x: tmp.getAt(j).lng(),
					y: tmp.getAt(j).lat()
				});
			}

			if (!tmp.getAt(tmp.length - 1).equals(tmp.getAt(0))) {
				if (i % 2 !== 0) {
					// In inner rings, coordinates are reversed...
					verts.unshift({ // Add the first coordinate again for closure
						x: tmp.getAt(tmp.length - 1).lng(),
						y: tmp.getAt(tmp.length - 1).lat()
					});
				} else {
					verts.push({ // Add the first coordinate again for closure
						x: tmp.getAt(0).lng(),
						y: tmp.getAt(0).lat()
					});
				}
			}

			if (obj.getPaths().length > 1 && i > 0) {
				// If this and the last ring have the same signs...
				if (sign(obj.getPaths().getAt(i)) > 0 && sign(obj.getPaths().getAt(i - 1)) > 0 || sign(obj.getPaths().getAt(i)) < 0 && sign(obj.getPaths().getAt(i - 1)) < 0 && !multiFlag) {
					// ...They must both be inner rings (or both be outer rings, in a multipolygon)
					verts = [verts]; // Wrap multipolygons once more (collection)
				}
			}

			//TODO This makes mistakes when a second polygon has holes; it sees them all as individual polygons
			if (i % 2 !== 0) {
				// In inner rings, coordinates are reversed...
				verts.reverse();
			}
			rings.push(verts);
		}

		response = {
			type: multiFlag ? 'multipolygon' : 'polygon',
			components: rings
		};
		return response;
	}

	// gmaps.Circle //////////////////////////////////////////////////////
	if (obj.constructor === gmaps.Circle) {
		var point = obj.getCenter();
		var radius = obj.getRadius();
		verts = [];
		var d2r = Math.PI / 180; // degrees to radians
		var r2d = 180 / Math.PI; // radians to degrees
		radius = radius / 1609; // meters to miles
		var earthsradius = 3963; // 3963 is the radius of the earth in miles
		var num_seg = 32; // number of segments used to approximate a circle
		var rlat = radius / earthsradius * r2d;
		var rlng = rlat / Math.cos(point.lat() * d2r);

		for (var n = 0; n <= num_seg; n++) {
			var theta = Math.PI * (n / (num_seg / 2));
			lng = point.lng() + rlng * Math.cos(theta); // center a + radius x * cos(theta)
			lat = point.lat() + rlat * Math.sin(theta); // center b + radius y * sin(theta)
			verts.push({
				x: lng,
				y: lat
			});
		}

		response = {
			type: 'polygon',
			components: [verts]
		};

		return response;
	}

	// gmaps.LatLngBounds ///////////////////////////////////////////////////
	if (obj.constructor === gmaps.LatLngBounds) {

		tmp = obj;
		verts = [];
		verts.push({ // NW corner
			x: tmp.getSouthWest().lng(),
			y: tmp.getNorthEast().lat()
		});

		verts.push({ // NE corner
			x: tmp.getNorthEast().lng(),
			y: tmp.getNorthEast().lat()
		});

		verts.push({ // SE corner
			x: tmp.getNorthEast().lng(),
			y: tmp.getSouthWest().lat()
		});

		verts.push({ // SW corner
			x: tmp.getSouthWest().lng(),
			y: tmp.getSouthWest().lat()
		});

		verts.push({ // NW corner (again, for closure)
			x: tmp.getSouthWest().lng(),
			y: tmp.getNorthEast().lat()
		});

		response = {
			type: 'polygon',
			isRectangle: true,
			components: [verts]
		};

		return response;
	}

	// gmaps.Rectangle ///////////////////////////////////////////////////
	if (obj.constructor === gmaps.Rectangle) {

		tmp = obj.getBounds();
		verts = [];
		verts.push({ // NW corner
			x: tmp.getSouthWest().lng(),
			y: tmp.getNorthEast().lat()
		});

		verts.push({ // NE corner
			x: tmp.getNorthEast().lng(),
			y: tmp.getNorthEast().lat()
		});

		verts.push({ // SE corner
			x: tmp.getNorthEast().lng(),
			y: tmp.getSouthWest().lat()
		});

		verts.push({ // SW corner
			x: tmp.getSouthWest().lng(),
			y: tmp.getSouthWest().lat()
		});

		verts.push({ // NW corner (again, for closure)
			x: tmp.getSouthWest().lng(),
			y: tmp.getNorthEast().lat()
		});

		response = {
			type: 'polygon',
			isRectangle: true,
			components: [verts]
		};

		return response;
	}

	// gmaps.Data Geometry Types /////////////////////////////////////////////////////

	// gmaps.Data.Feature /////////////////////////////////////////////////////
	if (obj.constructor === gmaps.Data.Feature) {
		return this.deconstruct.call(this, obj.getGeometry());
	}

	// gmaps.Data.Point /////////////////////////////////////////////////////
	if (obj.constructor === gmaps.Data.Point) {
		//console.zlog('It is a gmaps.Data.Point');
		response = {
			type: 'point',
			components: [{
				x: obj.get().lng(),
				y: obj.get().lat()
			}]
		};
		return response;
	}

	// gmaps.Data.LineString /////////////////////////////////////////////////////
	if (obj.constructor === gmaps.Data.LineString) {
		verts = [];
		//console.zlog('It is a gmaps.Data.LineString');
		for (i = 0; i < obj.getLength(); i += 1) {
			vertex = obj.getAt(i);
			verts.push({
				x: vertex.lng(),
				y: vertex.lat()
			});
		}
		response = {
			type: 'linestring',
			components: verts
		};
		return response;
	}

	// gmaps.Data.Polygon /////////////////////////////////////////////////////
	if (obj.constructor === gmaps.Data.Polygon) {
		rings = [];
		//console.zlog('It is a gmaps.Data.Polygon');
		for (i = 0; i < obj.getLength(); i += 1) {
			// For each ring...
			ring = obj.getAt(i);
			verts = [];
			for (j = 0; j < ring.getLength(); j += 1) {
				// For each vertex...
				vertex = ring.getAt(j);
				verts.push({
					x: vertex.lng(),
					y: vertex.lat()
				});
			}
			verts.push({
				x: ring.getAt(0).lng(),
				y: ring.getAt(0).lat()
			});

			rings.push(verts);
		}
		response = {
			type: 'polygon',
			components: rings
		};

		return response;
	}

	// gmaps.Data.MultiPoint /////////////////////////////////////////////////////
	if (obj.constructor === gmaps.Data.MultiPoint) {
		verts = [];
		for (i = 0; i < obj.getLength(); i += 1) {
			vertex = obj.getAt(i);
			verts.push([{
				x: vertex.lng(),
				y: vertex.lat()
			}]);
		}
		response = {
			type: 'multipoint',
			components: verts
		};
		return response;
	}

	// gmaps.Data.MultiLineString /////////////////////////////////////////////////////
	if (obj.constructor === gmaps.Data.MultiLineString) {
		linestrings = [];
		for (i = 0; i < obj.getLength(); i += 1) {
			verts = [];
			linestring = obj.getAt(i);
			for (j = 0; j < linestring.getLength(); j += 1) {
				vertex = linestring.getAt(j);
				verts.push({
					x: vertex.lng(),
					y: vertex.lat()
				});
			}
			linestrings.push(verts);
		}
		response = {
			type: 'multilinestring',
			components: linestrings
		};
		return response;
	}

	// gmaps.Data.MultiPolygon /////////////////////////////////////////////////////
	if (obj.constructor === gmaps.Data.MultiPolygon) {

		polygons = [];

		//console.zlog('It is a gmaps.Data.MultiPolygon');
		for (k = 0; k < obj.getLength(); k += 1) {
			// For each multipolygon
			polygon = obj.getAt(k);
			rings = [];
			for (i = 0; i < polygon.getLength(); i += 1) {
				// For each ring...
				ring = polygon.getAt(i);
				verts = [];
				for (j = 0; j < ring.getLength(); j += 1) {
					// For each vertex...
					vertex = ring.getAt(j);
					verts.push({
						x: vertex.lng(),
						y: vertex.lat()
					});
				}
				verts.push({
					x: ring.getAt(0).lng(),
					y: ring.getAt(0).lat()
				});

				rings.push(verts);
			}
			polygons.push(rings);
		}

		response = {
			type: 'multipolygon',
			components: polygons
		};
		return response;
	}

	// gmaps.Data.GeometryCollection /////////////////////////////////////////////////////
	if (obj.constructor === gmaps.Data.GeometryCollection) {

		var objects = [];
		for (k = 0; k < obj.getLength(); k += 1) {
			// For each multipolygon
			var object = obj.getAt(k);
			objects.push(this.deconstruct.call(this, object));
		}
		//console.zlog('It is a gmaps.Data.GeometryCollection', objects);
		response = {
			type: 'geometrycollection',
			components: objects
		};
		return response;
	}

	// Array ///////////////////////////////////////////////////////////////////
	if (Wkt.isArray(obj)) {
		features = [];

		for (i = 0; i < obj.length; i += 1) {
			features.push(this.deconstruct.call(this, obj[i], true));
		}

		response = {

			type: function () {
				var k,
				    type = obj[0].constructor;

				for (k = 0; k < obj.length; k += 1) {
					// Check that all items have the same constructor as the first item
					if (obj[k].constructor !== type) {
						// If they don't, type is heterogeneous geometry collection
						return 'geometrycollection';
					}
				}

				switch (type) {
					case gmaps.Marker:
						return 'multipoint';
					case gmaps.Polyline:
						return 'multilinestring';
					case gmaps.Polygon:
						return 'multipolygon';
					default:
						return 'geometrycollection';
				}
			}(),
			components: function () {
				// Pluck the components from each Wkt
				var i, comps;

				comps = [];
				for (i = 0; i < features.length; i += 1) {
					if (features[i].components) {
						comps.push(features[i].components);
					}
				}

				return {
					comps: comps
				};
			}()

		};
		response.components = response.components.comps;
		return response;
	}

	console.zlog('The passed object does not have any recognizable properties.');
};

function Wicket() {
	return new Wkt.Wkt();
}

function WKT2Object(WKT) {
	var wkt = new Wkt.Wkt();
	try {
		wkt.read(WKT);
	} catch (e) {
		console.zlog('Imposible leer geometría', WKT);
		return false;
	}
	try {
		var obj = wkt.toObject({
			reverseInnerPolygons: true
		}); // Make an object
		obj.wkt = wkt;
		return obj;
	} catch (e) {
		console.warn('Imposible exportar geometría', WKT);
		return false;
	}
}

var jqContainerLoading = null;
var preloaderFN = function preloaderFN(id_selector) {
	var preloader = $('<div class="preloader">'),
	    loading = $('<div class="preloader-wrapper big active" id="loading">'),
	    spinnerlayer = $('<div class="spinner-layer spinner-blue-only">').append('<div class="circle-clipper left"><div class="circle"></div></div>').append('<div class="gap-patch"><div class="circle"></div></div>').append('<div class="circle-clipper right"><div class="circle"></div>').appendTo(loading);

	preloader.append(loading).append('<div id="preload_text">');
	preloader.attr('id', id_selector.replace('#', ''));
	return preloader;
};
/**
 * Muestra un div con una animación de "cargando"
 * @param  {integer} timeout   segundos de timeout o un flag (0,1,2)
 * @param  {string} message mensaje a desplegar
 * @param  {string} container  selector CSS del contenedor
 * @return {void}
 */
function loadingcircle(timeout, message, container) {

	var theGlobalvars = window.globalvars || {};
	theGlobalvars.containerIds = theGlobalvars.containerIds || {};

	var loadingcircleId = theGlobalvars.containerIds.loadingcircleId || '#preloader';
	jqContainerLoading = jqContainerLoading || $(loadingcircleId);

	message = message || '';

	if (jqContainerLoading.length === 0) {
		jqContainerLoading = preloaderFN(loadingcircleId);
	}

	jqContainerLoading.attr('class', 'preloader');
	var removeContainer = function removeContainer(delay) {
		jqContainerLoading.addClass('animated fadeOut');
		jqContainerLoading.detach();
		var garbagedivs = $('body').find(loadingcircleId);

		window.setTimeout(function () {
			garbagedivs.detach();
		}, delay);
	};

	if (timeout === 0) {
		removeContainer(1500);
	} else {

		if (container) {
			jqContainerLoading.addClass('preloader_padding_container');
		} else {
			jqContainerLoading.addClass('preloader_padding');
			container = 'body';
		}
		$(container).append(jqContainerLoading);
		$('#preload_text').html(message);

		if (timeout >= 2) {
			timeout = Math.max(timeout, 2000);
			removeContainer(timeout);
		}
	}
	return jqContainerLoading;
}

var colorset = {
	"polygon_mycolor": {
		"rows": 4,
		"cols": 9,
		"subThemeColors": ["f2f2f2", "ddd9c3", "c6d9f0", "dbe5f1", "f2dcdb", "ebf1dd", "e5e0ec", "dbeef3", "fdeada", "d8d8d8", "c4bd97", "8db3e2", "b8cce4", "e5b9b7", "d7e3bc", "ccc1d9", "b7dde8", "fbd5b5", "bfbfbf", "938953", "548dd4", "95b3d7", "d99694", "c3d69b", "b2a2c7", "92cddc", "fac08f", "a5a5a5", "494429", "17365d", "366092", "953734", "76923c", "5f497a", "31859b", "e36c09", "7f7f7f", "1d1b10", "0f243e", "244061", "632423", "4f6128", "3f3151", "205867", "974806"]
	},
	"marker_mycolor": {
		"rows": 4,
		"cols": 8,
		"subThemeColors": ["000099", "990099", "990000", "FF3300", "333300", "006600", "006666", "666666", "0000CC", "CC00CC", "CC0000", "FF6600", "666600", "66BB66", "009999", "999999", "0000FF", "AA88CC", "FF0000", "FF9900", "CCCC00", "00CC00", "00CCCC", "CCCCCC", "5599CC", "CCBBDD", "FFAAAA", "FFCC99", "FFFF00", "AAEEAA", "00FFFF", "CCDDEE"]
	},
	"gradient_mycolor": {
		"rows": 6,
		"cols": 8,
		"subThemeColors": [["brown", ["hsla(50,48%,41%,0.1)", "hsla(64,60%,82%,0.7)", "hsla(62,60%,80%,0.8)", "hsla(60,60%,78%,0.9)", "hsl(58,60%,76%)", "hsl(56,60%,74%)", "hsl(54,60%,72%)", "hsl(52,60%,70%)", "hsl(49,60%,68%)", "hsl(46,60%,66%)", "hsl(43,60%,64%)", "hsl(40,60%,62%)", "hsl(37,60%,60%)", "hsl(34,60%,58%)", "hsl(31,61%,56%)", "hsl(28,62%,54%)", "hsl(25,63%,52%)", "hsl(22,64%,50%)", "hsl(19,65%,48%)", "hsl(16,66%,46%)", "hsl(13,67%,44%)", "hsl(10,68%,42%)", "hsl(7,69%,40%)", "hsl(4,70%,38%)", "hsl(1,71%,36%)", "hsl(358,72%,34%)", "hsl(355,73%,32%)", "hsl(352,74%,30%)", "hsl(349,75%,28%)", "hsl(346,76%,26%)", "hsl(343,77%,24%)"]], ["green", ["hsla(50,48%,41%,0.1)", "hsla(50,60%,82%,0.7)", "hsla(53,60%,80%,0.8)", "hsla(56,60%,78%,0.9)", "hsl(59,60%,76%)", "hsl(62,60%,74%)", "hsl(65,60%,72%)", "hsl(68,60%,70%)", "hsl(71,60%,68%)", "hsl(74,60%,66%)", "hsl(77,60%,64%)", "hsl(80,60%,62%)", "hsl(83,60%,60%)", "hsl(86,60%,58%)", "hsl(89,61%,56%)", "hsl(92,62%,54%)", "hsl(95,63%,52%)", "hsl(98,64%,50%)", "hsl(101,65%,48%)", "hsl(104,66%,46%)", "hsl(106,67%,44%)", "hsl(108,68%,42%)", "hsl(110,69%,40%)", "hsl(112,70%,38%)", "hsl(114,71%,36%)", "hsl(116,72%,34%)", "hsl(118,73%,32%)", "hsl(120,74%,30%)", "hsl(122,75%,28%)", "hsl(124,76%,26%)", "hsl(126,77%,24%)"]], ["blue", ["hsla(260,8%,64%,0.1)", "hsla(185,60%,82%,0.7)", "hsla(186,60%,80%,0.8)", "hsla(187,60%,78%,0.9)", "hsl(188,60%,76%)", "hsl(189,60%,74%)", "hsl(190,60%,72%)", "hsl(191,60%,70%)", "hsl(192,60%,68%)", "hsl(193,60%,66%)", "hsl(194,60%,64%)", "hsl(195,60%,62%)", "hsl(196,60%,60%)", "hsl(197,60%,58%)", "hsl(198,61%,56%)", "hsl(199,62%,54%)", "hsl(200,63%,52%)", "hsl(201,64%,50%)", "hsl(202,65%,48%)", "hsl(203,66%,46%)", "hsl(204,67%,44%)", "hsl(205,68%,42%)", "hsl(206,69%,40%)", "hsl(207,70%,38%)", "hsl(208,71%,36%)", "hsl(209,72%,34%)", "hsl(210,73%,32%)", "hsl(211,74%,30%)", "hsl(212,75%,28%)", "hsl(213,76%,26%)", "hsl(214,77%,24%)"]], ["purple", ["hsla(204,13%,62%,0.1)", "hsla(190,47%,82%,0.7)", "hsla(194,48%,80%,0.8)", "hsla(198,49%,78%,0.9)", "hsl(202,50%,76%)", "hsl(206,51%,74%)", "hsl(210,52%,72%)", "hsl(214,53%,70%)", "hsl(218,54%,68%)", "hsl(222,55%,66%)", "hsl(226,56%,64%)", "hsl(230,57%,62%)", "hsl(234,58%,60%)", "hsl(238,59%,58%)", "hsl(242,61%,56%)", "hsl(246,62%,54%)", "hsl(250,63%,52%)", "hsl(254,64%,50%)", "hsl(258,65%,48%)", "hsl(262,66%,46%)", "hsl(266,67%,44%)", "hsl(270,68%,42%)", "hsl(274,69%,40%)", "hsl(278,70%,38%)", "hsl(282,71%,36%)", "hsl(286,72%,34%)", "hsl(290,73%,32%)", "hsl(294,74%,30%)", "hsl(298,75%,28%)", "hsl(302,76%,26%)", "hsl(306,77%,24%)"]], ["greenred", ["hsla(120,52%,45%,0.1)", "hsla(120,60%,50%,0.7)", "hsla(115,60%,59%,0.8)", "hsla(110,60%,50%,0.9)", "hsl(105,60%,51%)", "hsl(100,60%,52%)", "hsl(95,60%,53%)", "hsl(90,60%,54%)", "hsl(85,60%,55%)", "hsl(80,61%,56%)", "hsl(75,62%,57%)", "hsl(70,63%,58%)", "hsl(67,64%,59%)", "hsl(64,65%,58%)", "hsl(59,65%,56%)", "hsl(56,65%,54%)", "hsl(53,65%,52%)", "hsl(50,65%,50%)", "hsl(47,65%,50%)", "hsl(44,66%,50%)", "hsl(41,67%,50%)", "hsl(38,68%,50%)", "hsl(35,69%,50%)", "hsl(32,70%,50%)", "hsl(28,71%,50%)", "hsl(24,72%,50%)", "hsl(20,73%,50%)", "hsl(16,74%,50%)", "hsl(12,75%,50%)", "hsl(8,76%,50%)", "hsl(0,77%,50%)"]], ["divergent", ["hsla(120,52%,45%,0.1)", "hsl(12,70%,50%)", "hsl(24,70%,50%)", "hsl(36,70%,50%)", "hsl(48,70%,50%)", "hsl(60,70%,50%)", "hsl(72,70%,50%)", "hsl(84,70%,50%)", "hsl(96,70%,50%)", "hsl(108,70%,50%)", "hsl(120,70%,50%)", "hsl(132,70%,50%)", "hsl(144,70%,50%)", "hsl(156,70%,50%)", "hsl(168,70%,50%)", "hsl(180,70%,50%)", "hsl(192,70%,50%)", "hsl(204,70%,50%)", "hsl(216,70%,50%)", "hsl(228,70%,50%)", "hsl(240,70%,50%)", "hsl(252,70%,50%)", "hsl(264,70%,50%)", "hsl(276,70%,50%)", "hsl(288,70%,50%)", "hsl(300,70%,50%)", "hsl(312,70%,50%)", "hsl(324,70%,50%)", "hsl(336,70%,50%)", "hsl(348,70%,50%)", "hsl(0,70%,50%)"]], ["venta", ["rgba(233,255,233,0.1)", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FFDB14", "#FFDB14", "#FFDB14", "#FFDB14", "#FFDB14", "#FFDB14", "#FFDB14", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000"]], ["stock", ["rgba(233,255,233,0.1)", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000"]]],
		"RGBColors": [["brown", ["rgba(155,155,55,0.1)", "rgba(255,255,204,0.6)", "rgba(255,255,204,0.6)", "rgb(255,237,160)", "rgb(254,217,118)", "rgb(254,217,118)", "rgb(254,178,76)", "rgb(254,178,76)", "rgb(253,141,60)", "rgb(253,141,60)", "rgb(252,78,42)", "rgb(252,78,42)", "rgb(227,26,28)", "rgb(227,26,28)", "rgb(177,0,38)", "rgb(177,0,38)"]], ["green", ["rgba(155,155,55,0.1)", "rgba(247,252,245,0.6)", "rgba(247,252,245,0.6)", "rgba(229,245,224,0.7)", "rgba(199,233,192,0.8)", "rgba(199,233,192,0.8)", "rgba(161,217,155,0.9)", "rgba(161,217,155,0.9)", "rgb(116,196,118)", "rgb(116,196,118)", "rgb(65,171,93)", "rgb(65,171,93)", "rgb(35,139,69)", "rgb(35,139,69)", "rgb(0,90,50)", "rgb(0,90,50)"]], ["blue", ["rgba(160,155,170,0.1)", "rgba(247,251,255,0.6)", "rgba(247,251,255,0.6)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(33,113,181)", "rgb(8,69,148)", "rgb(8,69,148)"]], ["purple", ["rgba(145,160,170,0.1)", "rgba(247,252,253,0.6)", "rgba(247,252,253,0.6)", "rgb(224,236,244)", "rgb(191,211,230)", "rgb(191,211,230)", "rgb(158,188,218)", "rgb(158,188,218)", "rgb(140,150,198)", "rgb(140,150,198)", "rgb(140,107,177)", "rgb(140,107,177)", "rgb(136,65,157)", "rgb(136,65,157)", "rgb(110,1,107)", "rgb(110,1,107)"]], ["greenred", ["rgba(55,175,55,0.1)", "rgba(224,255,224,0.6)", "rgba(224,255,224,0.6)", "rgba(166,217,106,0.7)", "rgba(217,239,139,0.8)", "rgba(217,239,139,0.8)", "rgba(246,246,102,0.9)", "rgba(246,246,102,0.9)", "rgba(254,224,139,1)", "rgba(254,224,139,1)", "rgba(253,174,97,1)", "rgba(253,174,97,1)", "rgba(244,109,67,1)", "rgba(244,109,67,1)", "rgba(227,40,39,1)", "rgba(227,40,39,1)"]], ["divergent", ["rgba(200,155,133,0.1)", "rgba(178,24,43,0.6)", "rgba(178,24,43,0.6)", "rgb(214,96,77)", "rgb(244,165,130)", "rgb(244,165,130)", "rgb(253,219,199)", "rgb(253,219,199)", "rgb(209,229,240)", "rgb(209,229,240)", "rgb(146,197,222)", "rgb(146,197,222)", "rgb(67,147,195)", "rgb(67,147,195)", "rgb(33,102,172)", "rgb(33,102,172)"]], ["venta", ["rgba(233,255,233,0.1)", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FFDB14", "#FFDB14", "#FFDB14", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000"]], ["stock", ["rgba(233,255,233,0.1)", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#008000", "#008000", "#008000", "#008000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000"]]]
	},
	"filter_mycolor": {
		"rows": 4,
		"cols": 8,
		"subThemeColors": ["000066", "660066", "660000", "CC3300", "666600", "006600", "006666", "333333", "000099", "990099", "990000", "FF3300", "999900", "009900", "009999", "666666", "0000CC", "CC00CC", "CC0000", "FF6600", "CCCC00", "00CC00", "00CCCC", "999999", "0000FF", "FF00FF", "FF0000", "FF9900", "FFFF00", "00FF00", "00FFFF", "CCCCCC"]
	}
};

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

var root$3 = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : Function('return this')();
var requestAnimationFrame = function requestAnimationFrame(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = root$3.setTimeout(function () {
        callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
};
var cancelAnimationFrame = function cancelAnimationFrame(id) {
    clearTimeout(id);
};

(function ($global, raf, caf) {

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !$global.requestAnimationFrame; ++x) {
        $global.requestAnimationFrame = $global[vendors[x] + 'RequestAnimationFrame'];
        $global.cancelAnimationFrame = $global[vendors[x] + 'CancelAnimationFrame'] || $global[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!$global.requestAnimationFrame) $global.requestAnimationFrame = raf;
    if (!$global.cancelAnimationFrame) $global.cancelAnimationFrame = caf;
})(root$3, requestAnimationFrame, cancelAnimationFrame);

var root = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global;

function setModalClass(cls, options) {

	options = options || {
		footer: true
	};
	var modal = $('#dialogomodal'),
	    modal_body = $('.modal-body'),
	    modal_footer = $('.modal-footer');

	modal.attr('style', '');
	modal.attr('class', cls + ' modal');
	modal_body.attr('style', '');

	if (options.footer === false) {
		modal_footer.addClass('invisible');
	} else {
		modal_footer.removeClass('invisible');
	}

	return modal;
}

function isArray(obj) {
	return Object.prototype.toString.call(obj) === "[object Array]";
}

function spaceString(str) {
	var cleanstr = String(str).replace(/[_]/g, ' ');
	return cleanstr;
}

/**
 * Method for cleaning special chars
 * @param  {String} str   source string
 * @param  {Boolean} strict if true, will replace even underscores
 * @return {String}        Clean string
 */
function cleanString(str, strict) {
	var cleanstr = String(str).replace(/[,.\-& ]/g, '_');
	if (strict) {
		cleanstr = cleanstr.replace(/[_-]/g, '').toLowerCase();
	}
	cleanstr = cleanstr.replace(/[ÀÁÂÃÄÅ]/g, "A");
	cleanstr = cleanstr.replace(/[àáâãäå]/g, "a");
	cleanstr = cleanstr.replace(/[ÈÉÊË]/g, "E");
	cleanstr = cleanstr.replace(/[é]/g, "e");
	cleanstr = cleanstr.replace(/[Í]/g, "I");
	cleanstr = cleanstr.replace(/[í]/g, "i");
	cleanstr = cleanstr.replace(/[Ó]/g, "O");
	cleanstr = cleanstr.replace(/(ó|ó)/g, "o");
	cleanstr = cleanstr.replace(/[Ú]/g, "U");
	cleanstr = cleanstr.replace(/[ú]/g, "u");
	cleanstr = cleanstr.replace(/[Ñ]/g, "N");
	cleanstr = cleanstr.replace(/[ñ]/g, "n");
	cleanstr = cleanstr.replace(/(__)+/g, '_');

	cleanstr = cleanstr.replace(/\'/g, '');
	return cleanstr;
}

function randomname(limit) {
	limit = limit || 5;
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < limit; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

function getCookie(name) {
	var match = root.document.cookie.match(new RegExp(name + '=([^;]+)'));
	if (match) {
		return match[1];
	}
}
var ig_helper = {
	ButtonFactory: ButtonFactory,
	Wkt: Wkt,
	Wicket: Wicket,
	WKT2Object: WKT2Object,
	loadingcircle: loadingcircle,
	colorset: colorset,
	setModalClass: setModalClass,
	isArray: isArray,
	spaceString: spaceString,
	cleanString: cleanString,
	randomname: randomname,
	getCookie: getCookie
};

exports.ButtonFactory = ButtonFactory;
exports.Wkt = Wkt;
exports.Wicket = Wicket;
exports.WKT2Object = WKT2Object;
exports.loadingcircle = loadingcircle;
exports.colorset = colorset;
exports.setModalClass = setModalClass;
exports.isArray = isArray;
exports.spaceString = spaceString;
exports.cleanString = cleanString;
exports.randomname = randomname;
exports.getCookie = getCookie;
exports['default'] = ig_helper;
exports.CollectionUtils = CollectionUtils;

Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=ig_helper.bundle.js.map
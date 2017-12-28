var renderString = require('./string');

function walkObject(object, handler) {
  if (Array.isArray(object)) return walkArray(object, handler);
  var result = {};

  for (var key in object) {
    result[walk(key, handler, null)] = walk(object[key], handler, key);
  }

  return result;
}

function walkArray(array, handler) {
  return array.map(function(input) {
    return walk(input, handler, null);
  });
}

/**
Walk the object and invoke the function on string types.

Why write yet-another cloner/walker? The primary reason is we also want to run
template functions on keys _and_ values which most clone things don't do.

@param {Object} input object to walk and duplicate.
@param {Function} handler handler to invoke on string types.
@param {?String} [key] key corresponding to input, if the latter is a value in object
*/
function walk(input, handler, key) {
  switch (typeof input) {
    // object is slightly special if null we move on
    case 'object':
      if (!input) return input;
      return walkObject(input, handler);

    case 'string':
      return handler(input, key);
    // all other types cannot be mutated
    default:
      return input;
  }
}

function render(object, view, handler) {
  handler = handler || renderString;

  return walk(object, function(value, key) {
    return handler(value, view, key);
  }, null);
}

module.exports = render;

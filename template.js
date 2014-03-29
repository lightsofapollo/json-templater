var TEMPLATE_OPEN = '{{';
var TEMPLATE_CLOSE = '}}';
var DELIMITER_OFFSET = 2;

/**
Convert a dotted path to a location inside an object.

@private
@example

  // returns xfoo
  extractValue('wow.it.works', {
    wow: {
      it: {
        works: 'xfoo'
      }
    }
  });

  // returns undefined
  extractValue('xfoo.bar', { nope: 1 });

@param {String} path dotted to indicate levels in an object.
@param {Object} view for the data.
*/
function extractValue(path, view) {
  var parts = path.split('.');

  while (
    // view should always be truthy as all objects are.
    view &&
    // must have a part in the dotted path
    (part = parts.shift())
  ) {
    view = (typeof view === 'object' && part in view) ?
      view[part] :
      undefined;
  }

  return view;
}

/**
Perform a string substitution based on tokens in the string.

XXX: This _could_ be done very easily with string.replace but it is slow
     and I am stubborn... Who knows maybe this can be used somewhere
     where performance is sensitive.

NOTE: tokens with corresponding values are skipped and left untouched.
*/
function replace(string, view) {
  var idx = 0;
  var nextOpenToken;
  // strictly appending a string is fast
  var buffer = '';

  while (
    (nextOpenToken = string.indexOf(TEMPLATE_OPEN, idx)) !== -1
  ) {
    // add the non-template variables
    buffer += string.substring(idx, nextOpenToken);

    // find the closing token
    var nextCloseToken = string.indexOf(TEMPLATE_CLOSE, nextCloseToken + DELIMITER_OFFSET);
    // location in the view which this token relates to
    var objPath = string.substring(
      nextOpenToken + DELIMITER_OFFSET,
      nextCloseToken
    );
    // value in the object path
    var value = extractValue(objPath, view);
    // move forward in the string for the next iteration

    if (value !== undefined) {
      // if we have a value do the replace
      buffer += value;
    } else {
      // otherwise leave it for some other template engine to deal with
      buffer += string.substring(nextOpenToken, nextCloseToken + DELIMITER_OFFSET);
    }

    idx = nextCloseToken + DELIMITER_OFFSET;
  }
  buffer += string.substring(idx);
  return buffer;
}

module.exports.replace = replace;

function render() {
}

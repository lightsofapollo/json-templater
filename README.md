# json-templater [![Build Status](https://travis-ci.org/lightsofapollo/json-templater.svg?branch=master)](https://travis-ci.org/lightsofapollo/json-templater)

JSON template(r) is an opinionated simple way to do mustache style
template replacements on your js and json objects (and of course
strings too)!.


## Usage: json-templater/string

The string submodule is a very simple mustache like variable replacement with no special features:

```js
var render = require('json-templater/string');
render('{{xfoo}} {{say.what}}', { xfoo: 'yep', say: { what: 'yep' } });
// yep yep
```

## Usage: json-templater/object

The much more interesting part of this module is the object sub-module which does a deep clone and runs strings through json-templater/string (including keys!)

`template.json:`
```json
{
  "magic_key_{{magic}}": {
    "key": "interpolation is nice {{value}}"
  }
}
```

```js
var object = require('json-templater/object');
object(
  require('./template.json'),
  { magic: 'key', value: 'value' }
);

// result

{
  magic_key_key: {
    key: 'interpolation is nice value'
  }
}

```

### Custom render

You can override default renderer using the third argument in `object` (`json-templater/string` is default):

`template.json:`
```json
{
  "magic": {
    "key": "interpolation is nice {{value}}"
  }
}
```

```js
var object = require('json-templater/object');

object(
  require('./template.json'),
  { magic: 'key', value: 'value' },
  function (value, data, key) {
    return value;
  }
);

// result

{
  "magic": {
    "key": "interpolation is nice {{value}}"
  }
}
```

#### key reference

Handler function gets three arguments:

- `value`: value which is about to be handled
- `data`: initial template data object
- `key`: key corresponding to the value

Using this data some complex logic could be implemented, for instance:

```js
var object = require('json-templater/object');
var string = require('json-templater/string');

object(
  require('./template.json'),
  { magic: 'key', value: 'value' },
  function (value, data, key) {
    // custom renderer for some special value
    if (key === 'specialKey') {
      return 'foo';
    }
    // usual string renderer
    return string(value, data);
  }
);

// result

{
  magic: {
    specialKey: "foo",
    key: "interpolation is nice value"
  }
}
```

## LICENSE

Copyright (c) 2014 Mozilla Foundation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

suite('template', function() {
  var assert = require('assert');
  var subject = require('./template');

  suite('#replace', function() {

    function verify(title, input, output) {
      test(title, function() {
        var result = subject.replace.apply(subject, input);
        assert.equal(output, result);
      });
    }

    verify('no token', ['woot', {}], 'woot');

    verify(
      'token no value',
      ['{{token}}', {}],
      '{{token}}'
    );

    verify(
      'one token',
      ['{{token}}', { token: 'v' }],
      'v'
    );

    verify(
      'nested token',
      ['{{foo.bar.baz}}', { foo: { bar: { baz: 'baz' } } }],
      'baz'
    );

    verify(
      'nested token no value',
      ['{{foo.bar}}', { foo: {} }],
      '{{foo.bar}}'
    );

    verify(
      'replace in the middle of string',
      [
        'foo bar {{baz}} qux',
        { baz: 'what?' }
      ],
      'foo bar what? qux'
    );

    verify(
      'multiple replacements',
      [
        '{{a}} {{woot}} bar baz {{yeah}}',
        { a: 'foo', yeah: true }
      ],
      'foo {{woot}} bar baz true'
    );

    verify(
      'object notation for non-object',
      [
        '{{a.b.c}} what',
        { a: { b: 'iam b' } }
      ],
      '{{a.b.c}} what'
    );
  });
});

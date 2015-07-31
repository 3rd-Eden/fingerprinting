describe('fingerprinting', function () {
  'use strict';

  var assume = require('assume')
    , finger = require('./');

  var fixture = require('path').join(__dirname, 'fixture.js')
    , content = require('fs').readFileSync(fixture)
    , md5 = '04ac8c2e3e72acdff31150af8c471226';

  it('is exposed as function', function () {
    assume(finger).is.a('function');
  });

  it('generates an unique filename', function () {
    var print = finger(fixture, {
      content: content
    });

    assume(print).is.a('object');
    assume(print).has.length(2);
    assume(print.file).equals(md5 +'.dev.js');
    assume(print.id).equals(md5);
  });

  it('includes a filename for the map', function () {
    var print = finger(fixture, {
      content: content,
      map: true
    });

    assume(print).is.a('object');
    assume(print).has.length(3);
    assume(print.file).equals(md5 +'.dev.js');
    assume(print.map).equals(md5 +'.dev.map');
    assume(print.id).equals(md5);
  });

  it('reads the source of the filename if no content is supplied', function () {
    var print = finger(fixture);

    assume(print).is.a('object');
    assume(print).has.length(2);
    assume(print.file).equals(md5 +'.dev.js');
    assume(print.id).equals(md5);
  });

  it('generates different suffixes based on the NODE_ENV', function () {
    process.env.NODE_ENV = 'production';

    var print = finger(fixture, {
      content: content
    });

    assume(print).is.a('object');
    assume(print).has.length(2);
    assume(print.file).equals(md5 +'.min.js');
    assume(print.id).equals(md5);

    process.env.NODE_ENV = '';
  });

  it('generates different suffixes based on the supplied env', function () {
    var print = finger(fixture, {
      content: content,
      env: 'test'
    });

    assume(print).is.a('object');
    assume(print).has.length(2);
    assume(print.file).equals(md5 +'.test.js');
    assume(print.id).equals(md5);
  });

  it('generates filesnames based on the supplied format', function () {
    var print = finger(fixture, {
      format: 'foo-{hash}-generated.{ext}',
      content: content
    });

    assume(print).is.a('object');
    assume(print.id).equals(md5);
    assume(print.file).equals('foo-'+ md5 +'-generated.js');
    assume(print).has.length(2);
  });
});

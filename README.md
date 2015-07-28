# fingerprinting

[![Version npm][version]](http://browsenpm.org/package/fingerprinting)[![Build Status][build]](https://travis-ci.org/3rd-Eden/fingerprinting)[![Dependencies][david]](https://david-dm.org/3rd-Eden/fingerprinting)[![Coverage Status][cover]](https://coveralls.io/r/3rd-Eden/fingerprinting?branch=master)

[version]: https://img.shields.io/npm/v/fingerprinting.svg?style=flat-square
[build]: https://img.shields.io/travis/3rd-Eden/fingerprinting/master.svg?style=flat-square
[david]: https://img.shields.io/david/3rd-Eden/fingerprinting.svg?style=flat-square
[cover]: https://img.shields.io/coveralls/3rd-Eden/fingerprinting/master.svg?style=flat-square

Fingerprinting is a cache-busting technique which allows you to expire files
when they actually change this is done by altering the filenames of the files.
This way you can set far future expire headers without having to worry that your
users might see stale or old files. Providing you with best of 2 worlds, cached
assets for increased performance with sacrificing your ability to instantly
modify files.

## Installation

The module is released in the public npm registry and can be installed by
running:

```
npm install --save fingerprinting
```

## Usage

The `fingerprinting` module is exposed as a single function that generates the
new filenames for your files. In all examples we assume that you've already
required the module as followed;

```js
'use strict';

var finger = require('fingerprinting');
```

The exported `finger` function accepts the following arguments:

- **file** The path to the file or filename of the file where we're generating
  the file from. This is used to extract the file extension and read the file
  contents if no `contents` option is provided (please do note that reading is
  done using a *sync* fs method).
- **options** Optional configuration for the fingerprint generation:
  - **format**: Template that specifies the format of the generated fingerprint.
    Defaults to `{hash}.{suffix}.{ext}`.
  - **algorithm** Hashing algorithm to be used to generate source hash. Defaults
    to `md5`.
  - **map** Also generate an unique id for source maps. Defaults to `false`.
  - **env** Environment that we're generating it for. It is used to generate the
    suffix in the filename format. For example `production` generates a `min`
    suffix while a mising or development generates a `dev` suffix. Defaults to
    `NODE_ENV`.
  - **content** The actual content of the filename. This eliminates the need to
    do a `fs.readFileSync` within the code. It can be either a string or Buffer.

The function returns an object with 2 keys:

- **file** This is the new filename for the given file.
- **map** If the *map* option was set to `true` this will contain the filename
  for your source map file.

#### Example

```js
var fs = require('fs');

fs.readFile(__dirname + '/index.js', function (err, buffer) {
  if (err) throw err;

  var print = finger('index.js', {
    content: buffer
  });

  console.log('print:', print.file); // 167f581dd914ba9d3d2e6c8820a5caa6.dev.js
});
```

## License

MIT

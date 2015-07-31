'use strict';

var crypto = require('crypto')
  , path = require('path')
  , fs = require('fs');

/**
 * Mapping of environment's to file suffixes.
 *
 * @type {Object}
 * @private
 */
var env = {
  development: 'dev',
  production: 'min',
  testing: 'test',
  test: 'test'
};

/**
 * Generate a unique id for the given file.
 *
 * Options:
 *
 * - format: Template that specifies the format of the generated fingerprint.
 * - algorithm: Hashing algorithm to be used to generate source hash.
 * - map: Also generate an unique id for source maps.
 * - env: Environment that we're generating it for.
 * - content: The actual content of the filename.
 *
 * @param {String} file Name of the file we're finger printing.
 * @param {Object} options Additional configuration.
 * @returns {Object}
 * @api public
 */
module.exports = function fingerprinting(file, options) {
  options = options || {};

  //
  // Assign some default values to the options.
  //
  options.content = options.content || fs.readFileSync(file);
  options.format = options.format || '{hash}.{suffix}.{ext}';
  options.env = options.env || process.env.NODE_ENV;
  options.algorithm = options.algorithm || 'md5';

  var hash = crypto.createHash(options.algorithm)
    , print = options.format
    , result = {};

  hash.update(options.content);
  result.id = hash.digest('hex');

  print = print.replace('{suffix}', env[options.env] || 'dev');
  print = print.replace('{hash}', result.id);

  //
  // Generate result structure and filenames.
  //
  if (options.map) result.map = print.replace('{ext}', 'map');
  result.file = print.replace('{ext}', path.extname(file).slice(1));

  return result;
};

const dns = require('node:dns');
const original = dns.lookup;
dns.lookup = function(host, options, callback) {
  return original.call(this, host === 'redis-server' ? '127.0.0.1' : host, options, callback);
};

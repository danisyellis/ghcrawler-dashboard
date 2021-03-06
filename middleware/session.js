// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const session = require('express-session');
const RedisStore = require('connect-redis')(session);

module.exports = function (app, config, redisClient) {
  var redisOptions = {
    client: redisClient,
    ttl: config.redis.ttl,
    prefix: config.redis.prefix + '.session:',
  };
  var settings = {
    store: new RedisStore(redisOptions),
    secret: config.session.salt,
    name: config.session.name || 'sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: config.redis.ttl * 1000 /* milliseconds for maxAge, not seconds */
    }
  };
  if (!config.webServer.allowHttp) {
    settings.cookie.secure = true;
  }
  if (config.session.domain) {
    settings.cookie.domain = config.session.domain;
  }
  return session(settings);
};

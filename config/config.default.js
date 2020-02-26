'use strict';

module.exports = () => {
  const config = {};

  config.customLogger = {
    pomeloLogger: {
      consoleLevel: 'INFO',
      file: 'egg-pomelo.log',
    },
  };

  config.pomelo = {
    client: {
      master: {
        host: '127.0.0.1',
        port: 3005,
        username: 'admin',
        password: 'admin',
      },
    },
  };

  return config;
};


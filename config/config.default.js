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
    // custom additional directory, full path
    directory: [],
  };

  return config;
};


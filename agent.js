'use strict';

const scA = require('./lib/pomeloAgent');

module.exports = agent => {

  agent.messenger.on('egg-pomelo', (...args) => {
    agent.pomelo.runCmd(...args);
  });

  agent.messenger.once('egg-ready', () => {
    // start schedule after worker ready
    scA(agent);
  });

};

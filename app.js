'use strict';
const scA = require('./lib/pomeloApp');

module.exports = app => {
  // register schedule event
  app.messenger.on('egg-pomelo', (...args) => {
    app.pomelo.onCmdEvt(...args);
  });

  app.messenger.once('egg-ready', () => {
    // start schedule after worker ready
    scA(app);
  });
};

'use strict';


const sc = require('./pomeloManagerApp'); // -- you code here require is 'sdb_schedule'


module.exports = app => {
  app.addSingleton('pomelo', createClient);
};

async function createClient(config, app) {
  // test config
  // app.coreLogger.info('[egg-pomelo] connecting %s@%s:%s/%s', config.user, config.server, config.port, config.database);

  /** @type {sc} */
  let cli = null;
  if (cli === null) {
    cli = new sc({}, app);
  }

  // 做启动应用前的检查
  app.beforeStart(async () => {
    app.coreLogger.info('[pomelo app] instance status OK');
  });
  return cli;
}

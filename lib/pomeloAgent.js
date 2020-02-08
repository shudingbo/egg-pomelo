'use strict';


const sc = require('./pomeloManagerAgent'); // -- you code here require is 'sdb_schedule'


module.exports = agent => {
  agent.addSingleton('pomelo', createClient);
};

async function createClient(config, agent) {
  // test config
  // agent.coreLogger.info('[egg-pomelo] connecting %s@%s:%s/%s', config.user, config.server, config.port, config.database);

  /** @type {sc} */
  let cli = null;
  if (cli === null) {
    cli = new sc(config, agent);
  }

  // 做启动应用前的检查
  agent.beforeStart(async () => {
    agent.coreLogger.info('[pomelo agent] instance status OK');
  });
  return cli;
}

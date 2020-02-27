'use strict';

const adminClient = require('@sex-pomelo/sex-pomelo-admin').adminClient;
const commandMgr = require('./command');
const util = require('./util');

/** pomelo Manafer for Agent
 *
 */
class PomeloManagerAgent {

  constructor(opt, agent) {
    this.agent = agent;
    this.logger = agent.getLogger('pomeloLogger');
    this.drv = this.createClient(opt, agent);
    this.config = opt;
    this.command = new commandMgr(this);

    // end start
    this.logger.info('[pomelo-ag] start init ...');
  }

  createClient(config, agent) {
    const { host, port, username, password } = config;

    let client = null;
    client = new adminClient({
      username,
      password,
      md5: true,
    });
    const id = 'pomelo_cli_' + Date.now();

    const self = this;
    client.connect(id, host, port, function(err) {
      if (err) {
        agent.coreLogger.warn('[pomelo-ag] ', err);
      } else {
        const msg = `[pomelo-ag] connect to master ${host}:${port}!`;
        agent.coreLogger.info(msg);
        self.logger.info(msg);
      }
    }, false);

    client.on('close', function() {
      self.logger.info('[pomelo-ag] disconnect from master!');
      client.socket.disconnect();
      agent.coreLogger.warn('[pomelo-ag] disconnect from master!');
    });

    return client;
  }


  /** Send action to All egg worker
	 *
	 * @param {Object} evtInfo evt object
	 * @param {Number} evtInfo.method 发送的方法
	 */
  runActionToAll(evtInfo) {
    this.agent.messenger.sendToApp('egg-pomelo', evtInfo);
  }

  /** handle evt from app
	 *
	 * @param {Object} evtInfo evtInfo
	 */
  runCmd(evtInfo) {
    if (this.drv.isConnected() === false) {
      this.sendMsgErr(evtInfo, 'Not connected to pomelo-master');
      return;
    }

    const { username } = this.config;
    const { key } = evtInfo;
    this.logger.debug('[pomelo-ag] run Cmd:', evtInfo);
    switch (key) {
      case 'help':
      case '?':
        {
          const szInfo = util.help();
          this.sendMsgOK(evtInfo, { message: szInfo });
        } break;
      default:
        this.command.handle(key, {
          user: username,
        }, this.drv, evtInfo);
        break;
    }
  }


  getConfig() {
    return this.config;
  }

  /** 发送信息
   * @param {object} cmdCtx cmd run context
   * @param {object} data - return data
   */
  sendMsgOK(cmdCtx, data) {
    if (arguments.length !== 2) {
      const err = new Error('sendMsgOK err length!');
      this.logger.warn('[pomelo-ag] sendMsgOK ...', err.stack);
    }
    const ret = {
      cmdIdx: cmdCtx.cmdIdx,
      status: true,
      masterName: (typeof (cmdCtx.masterName) === 'string') ? cmdCtx.masterName : null,
      data,
    };

    this.agent.messenger.sendTo(cmdCtx.pid, 'egg-pomelo', ret);
  }

  /** 发送错误信息
   * @param {object} cmdCtx cmd run context
   * @param {string} err err message
   */
  sendMsgErr(cmdCtx, err) {
    if (arguments.length !== 2) {
      const err = new Error('sendMsgErr err length!');
      this.logger.warn('[pomelo-ag] sendMsgErr ...', err.stack);
    }

    const ret = {
      cmdIdx: cmdCtx.cmdIdx,
      status: false,
      masterName: (typeof (cmdCtx.masterName) === 'string') ? cmdCtx.masterName : null,
      message: err,
    };

    this.agent.messenger.sendTo(cmdCtx.pid, 'egg-pomelo', ret);
  }

}

module.exports = PomeloManagerAgent;


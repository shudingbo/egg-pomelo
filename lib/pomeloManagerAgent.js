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
    const { host, port, username, password } = config.master;

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
        agent.coreLogger.info('[pomelo-ag] connect to master!');
        self.logger.info('[pomelo-ag] connect to master!');
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
      this.sendMsgErr(evtInfo.pid, evtInfo.cmdIdx, 'Not connected to pomelo-master');
      return;
    }

    const { username } = this.config.master;
    const { key } = evtInfo;
    this.logger.debug('[pomelo-ag] run Cmd:', evtInfo);
    switch (key) {
      case 'help':
      case '?':
        {
          const szInfo = util.help();
          this.sendMsgOK(evtInfo.pid, evtInfo.cmdIdx, { message: szInfo });
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
   * @param {number} pid app worker's pid
   * @param {number} cmdIdx command idx
   * @param {object} data - return data
   */
  sendMsgOK(pid, cmdIdx, data) {
    if (arguments.length !== 3) {
      const err = new Error('sendMsgOK err length!');
      this.logger.warn('[pomelo-ag] sendMsgOK ...', err.stack);
    }
    const ret = {
      cmdIdx,
      status: true,
      data,
    };

    this.agent.messenger.sendTo(pid, 'egg-pomelo', ret);
  }

  /** 发送错误信息
   * @param {number} pid app worker's pid
   * @param {number} cmdIdx command idx
   * @param {string} err err message
   */
  sendMsgErr(pid, cmdIdx, err) {
    if (arguments.length !== 3) {
      const err = new Error('sendMsgErr err length!');
      this.logger.warn('[pomelo-ag] sendMsgErr ...', err.stack);
    }

    const ret = {
      cmdIdx,
      status: false,
      message: err,
    };
    this.agent.messenger.sendTo(pid, 'egg-pomelo', ret);
  }

}

module.exports = PomeloManagerAgent;


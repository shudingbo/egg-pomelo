'use strict';

const process = require('process');
const EventEmitter = require('events');

class SchexEmitter extends EventEmitter {}


/** pomelo Manafer for APP
 *
 */
class PomeloManagerApp {
  /**
   * @class
   * @param {object} opt opt
   * @param {Application} app egg-js app
   */
  constructor(opt, app) {

    this.app = app;
    this.logger = app.getLogger('pomeloLogger');
    this.jobs = {};
    this.logger.info('[pomelo-ap] start init sex-pomelo-cli worker ...');

    this.curOperaCtlMethod = null; // 当前正在处理的控制方法
    this.emitter = new SchexEmitter();
  }

  /** 运行命令
   *
   * @param {string} cmd 命令对象
   * @param {string} context 上下文（服务器名称）
   *
   * @return {{status:boolean},{data:object}} data 返回数据
   */
  async runAction(cmd, context = 'all') {
    this.logger.debug('run action:', cmd, context);
    const info = {
      key: cmd,
      pid: process.pid,
      context,
    };

    info.pid = process.pid;
    info.context = context;
    this.app.messenger.sendToAgent('egg-pomelo', info);

    return new Promise((resolve, rejecte) => {
      this.emitter.on('evtRet', evtInfo => {
        resolve(evtInfo);
      });
    });
  }


  async execStr(script, context) {
    return await this.runAction(`execStr ${script}`, context);
  }

  onCmdEvt(evtInfo) {
    // this.logger.debug('receive Data：', evtInfo);
    this.emitter.emit('evtRet', evtInfo);
    return;
  }

} // end class


module.exports = PomeloManagerApp;


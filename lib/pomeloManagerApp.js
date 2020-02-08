'use strict';

const process = require('process');
const EventEmitter = require('events');

class SchexEmitter extends EventEmitter {}


/** schex Manafer for APP
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
    this.logger = app.getLogger('schexLogger');
    this.jobs = {};
    this.logger.info('[pomelo-ap] start init schex worker ...');

    this.curOperaCtlMethod = null; // 当前正在处理的控制方法
    this.emitter = new SchexEmitter();
  }

  /**
   *
   * @param {object} info 命令对象
   * @param {string} context 上下文（服务器名称）
   */
  async runAction(info, context = 'all') {
    console.log('run action:', info, context);
    info.pid = process.pid;
    info.context = context;
    this.app.messenger.sendToAgent('egg-pomelo', info);

    return new Promise((resolve, rejecte) => {
      this.emitter.on('evtRet', evtInfo => {
        resolve(evtInfo);
      });
    });
  }


  onCmdEvt(evtInfo) {
    console.log('receive Data：', evtInfo);
    this.emitter.emit('evtRet', evtInfo);
    return;
  }

  sendMsg(job, step, err, addInfo) {
    const info = {
      name: job.name,
      ctx: job.ctx,
      step,
      err,
      msg: (job.msg !== undefined) ? job.msg : '',
      addInfo: (addInfo !== undefined) ? addInfo : {},
    };

    if (info.addInfo.method !== undefined) {
      info.method = info.addInfo.method;
    }

    if (job.parent !== null) {
      if (this.jobs[job.parent] !== undefined) {
        info.ctx = this.jobs[ job.parent ].ctx;
      } else {
        info.ctx = {};
      }
    }
    this.app.messenger.sendToAgent('egg-pomelo', info);
  }

} // end class


module.exports = PomeloManagerApp;


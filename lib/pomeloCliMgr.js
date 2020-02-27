'use strict';

const sc = require('./pomeloManagerAgent');

class pomeloCliMgr {

  constructor(config, agent) {
    this.agent = agent;
    this.clis = {};
    this.defCli = null;

    let master = config.master;
    if ((master instanceof Array) === false) {
      master = [ config.master ];
    }

    for (const it of master) {
      let name = `${it.host}-${it.port}`;
      if (typeof (it.alias) === 'string') {
        name = it.alias;
      }

      const cli = new sc(it, agent);

      this.clis[name] = {
        config: it,
        ins: cli,
      };

      this.defCli = cli;
    }
  }

  runCmd(evtInfo) {
    if (typeof (evtInfo.mgrCmd) === 'string') {
      this.runMgrCmd(evtInfo);
    } else {
      let ins = this.defCli;
      if (typeof (evtInfo.masterName) === 'string') {
        const cli = this.clis[evtInfo.masterName];
        if (cli !== undefined) {
          ins = cli.ins;
        }
      }

      ins.runCmd(evtInfo);
    }
  }

  runMgrCmd(cmdInfo) {
    switch (cmdInfo.mgrCmd) {
      case 'getMasters':
        {
          const data = [];
          for (const it in this.clis) {
            data.push(this.clis[it].config);
          }
          this.sendMsgOK(cmdInfo, data);

        } break;
      default:
        this.sendMsgErr(cmdInfo, `Unsupport MgrCmd: ${cmdInfo.mgrCmd}`);
        break;
    }
  }

  /** 发送信息
   * @param {object} cmdCtx cmd run context
   * @param {object} data - return data
   */
  sendMsgOK(cmdCtx, data) {
    const ret = {
      cmdIdx: cmdCtx.cmdIdx,
      status: true,
      data,
    };

    this.agent.messenger.sendTo(cmdCtx.pid, 'egg-pomelo', ret);
  }

  /** 发送错误信息
   * @param {object} cmdCtx cmd run context
   * @param {string} err err message
   */
  sendMsgErr(cmdCtx, err) {
    const ret = {
      cmdIdx: cmdCtx.cmdIdx,
      status: false,
      message: err,
    };

    this.agent.messenger.sendTo(cmdCtx.pid, 'egg-pomelo', ret);
  }
}


module.exports = pomeloCliMgr;


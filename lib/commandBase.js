'use strict';

const util = require('./util');
const consts = require('./consts');

const ignoreMoreParamCheckCmd = [ 'kill', 'systemInfo', 'nodeInfo', 'monitorLog' ];

class CommandBase {

  constructor(cmdMgr) {
    /** @type { import('./command').CommandManager } */
    this.cmdMgr = cmdMgr;
    this.context = 'all';
    this.ctxPid = -1;
    this.cmdReqId = -1;

    this.commandId = 'help';
    this.helpCommand = 'help';
  }

  /**
   *
   * @param {object} ctx 上下文
   * @param {string} comd 命令
   * @param {string} argv 原始命令
   * @param {object} msg 消息
   */
  handleFilter(ctx, comd, argv, msg) {
    if (typeof (ctx.context) === 'string') {
      this.context = ctx.context;
    }

    if (typeof (ctx.pid) === 'number') {
      this.ctxPid = ctx.pid;
    }

    this.ctx = ctx;
    this.argv = argv;
    this.msg = msg;
    this.cmdReqId = ctx.cmdIdx;

    // 检测是否有附件参数
    if (!comd && ignoreMoreParamCheckCmd.indexOf(this.commandId) === -1) {
      if (this.commandId === 'help') {
        this.sendErr(consts.COMANDS_UNKNOWN + argv);
      } else {
        this.sendHelp(this.helpCommand, msg);
      }

      return;
    }

    this.handle(comd, argv, msg);
  }

  /** 获取命令执行上下文
   *
   */
  getContext() {
    return this.context;
  }

  /** 返回数据
   *
   * @param {object} data 数据
   */
  sendOk(data) {
    this.cmdMgr.agent.sendMsgOK(this.ctx, data);
  }

  /** 发送错误信息
   *
   * @param {string} err 错误信息
   */
  sendErr(err) {
    this.cmdMgr.agent.sendMsgErr(this.ctx, err);
  }

  /** 发送帮助命令
   *
   * @param {string} helpCommand 帮助命令
   * @param {string } msg 信息
   */
  sendHelp(helpCommand, msg) {
    const argvs = util.argsFilter(helpCommand);
    // const comd = argvs[0];
    const comd1 = argvs[1] || '';

    this.handleHelp(comd1, helpCommand, msg);
  }

  handleHelp(comd, argv, msg) {
    if (!comd) {
      this.sendErr(consts.COMANDS_UNKNOWN + argv);
      return;
    }

    const argvs = util.argsFilter(argv);

    if (argvs.length > 2) {
      this.sendErr(consts.COMANDS_UNKNOWN + argv);
      return;
    }
    if (comd === 'help') {
      const szInfo = help();
      this.sendOk({ message: szInfo });
      return;
    }

    if (consts.COMANDS_MAP[comd]) {
      const INFOS = consts.COMANDS_MAP[comd];
      let szOut = '';
      for (let i = 0; i < INFOS.length; i++) {
        szOut += util.formatStr(INFOS[i]);
      }
      this.sendErr(szOut);
      return;
    }

    this.sendErr(consts.COMANDS_UNKNOWN + argv);
  }

}

module.exports = CommandBase;

function help() {
  let szOut = '';
  for (const it of consts.HELP_INFO_1) {
    szOut += util.formatStr(it);
  }

  for (const it of consts.COMANDS_ALL) {
    szOut += util.formatStr(`${it[0]} ${it[1]}`);
  }

  for (const it of consts.HELP_INFO_2) {
    szOut += util.formatStr(it);
  }

  return szOut;
}


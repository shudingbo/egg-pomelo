'use strict';

const util = require('./util');
const consts = require('./consts');
const CommandManager = require('./command');

class CommandBase {

  constructor(cmdMgr) {
    /** @type { CommandManager } */
    this.cmdMgr = cmdMgr;
    this.context = 'all';
    this.ctxPid = -1;

    this.commandId = 'help';
    this.helpCommand = 'help';
  }

  handleFilter(ctx, comd, argv, msg) {
    if (typeof (ctx.context) === 'string') {
      this.context = ctx.context;
    }

    if (typeof (ctx.pid) === 'number') {
      this.ctxPid = ctx.pid;
    }

    this.argv = argv;
    this.msg = msg;

    if (!comd) {
      if (this.commandId === 'help') {
        this.sendErr(consts.COMANDS_UNKNOWN + argv);
      } else {
        this.sendHelp(this.helpCommand, msg);
      }

      return;
    }

    this.handle(comd, argv, msg);
  }

  getContext() {
    return this.context;
  }

  sendOk(data) {
    this.cmdMgr.agent.sendMsgOK(this.ctxPid, data);
  }

  sendErr(err) {
    this.cmdMgr.agent.sendMsgErr(this.ctxPid, err);
  }

  sendHelp(helpCommand, msg) {
    const argvs = util.argsFilter(helpCommand);
    const comd = argvs[0];
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
      this.sendOk({ message: szOut });
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


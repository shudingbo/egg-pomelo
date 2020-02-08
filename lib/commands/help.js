
'use strict';

const util = require('../util');
const consts = require('../consts');

const CommandBase = require('../commandBase');

class Command extends CommandBase {
  constructor(cmdMgr) {
    super(cmdMgr);
    this.commandId = 'help';
  }

  handle(comd, argv, msg) {
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
      const szInfo = util.help();
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

module.exports = function(cmdMgr) {
  return new Command(cmdMgr);
};


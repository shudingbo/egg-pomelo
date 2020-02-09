'use strict';

const util = require('../util');
const consts = require('../consts');
const CommandBase = require('../commandBase');

class CommandStop extends CommandBase {
  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'stop';
    this.helpCommand = 'help stop';
  }

  handle(comd, argv, msg) {
    const argvs = util.argsFilter(argv);

    let ids = [];
    if (comd !== 'all') {
      ids = argvs.slice(1);
    }

    this.cmdMgr.client.request(consts.CONSOLE_MODULE, {
      signal: 'stop',
      ids,
    }, (err, data) => {
      if (err) {
        this.sendErr(err);
      } else {
        this.sendOk(data.msg);
      }
    });
  }
}

module.exports = function(cmdMgr) {
  return new CommandStop(cmdMgr);
};


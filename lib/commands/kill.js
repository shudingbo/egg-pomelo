'use strict';

const consts = require('../consts');
const CommandBase = require('../commandBase');

class CommandKill extends CommandBase {
  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'kill';
    this.helpCommand = 'help kill';
  }

  handle(comd, argv, msg) {
    comd; argv; msg;
    this.cmdMgr.client.request(consts.CONSOLE_MODULE, {
      signal: 'kill',
    }, (err, data) => {
      if (err) {
        this.sendErr(err);
      } else {
        this.sendOk(data.msg);
      }
    });

  }

}

module.exports = function(opts) {
  return new CommandKill(opts);
};


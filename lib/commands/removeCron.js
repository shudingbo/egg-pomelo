'use strict';

const util = require('../util');
const consts = require('../consts');

const CommandBase = require('../commandBase');


class CommandRemoveCron extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'removeCron';
    this.helpCommand = 'help removeCron';
  }

  handle(comd, argv, msg) {
    if (!comd) {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    const argvs = util.argsFilter(argv);

    this.cmdMgr.client.request(consts.CONSOLE_MODULE, {
      signal: 'removeCron',
      args: argvs.slice(1),
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
  return new CommandRemoveCron(opts);
};


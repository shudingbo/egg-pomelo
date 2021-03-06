'use strict';

const util = require('../util');
const consts = require('../consts');

const CommandBase = require('../commandBase');

class CommandGet extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'get';
    this.helpCommand = 'help get';
  }

  handle(comd, argv, msg) {
    const Context = this.getContext();
    if (Context === 'all') {
      this.sendErr('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
      return;
    }

    const argvs = util.argsFilter(argv);

    if (argvs.length < 2) {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    this.cmdMgr.client.request('watchServer', {
      comd: this.commandId,
      param: comd,
      context: Context,
    }, (err, data) => {
      if (err) {
        this.sendErr(err);
      } else {
        if (data === undefined) {
          this.sendErr(`the server ${Context} not exist`);
        } else {
          this.sendOk(data);
        }
      }
    });
  }
}

module.exports = function(cmdMgr) {
  return new CommandGet(cmdMgr);
};


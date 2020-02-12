'use strict';

const util = require('../util');
const consts = require('../consts');
const CommandBase = require('../commandBase');

class CommandSet extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'set';
    this.helpCommand = 'help set';
  }

  handle(comd, argv, msg) {
    if (!comd) {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    const Context = this.getContext();
    if (Context === 'all') {
      this.sendErr('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
      return;
    }

    const argvs = util.argsFilter(argv);

    if (argvs.length < 3) {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    const param = {
      key: argvs[1],
      value: argvs[2],
    };

    this.cmdMgr.client.request('watchServer', {
      comd: this.commandId,
      param,
      context: Context,
    }, (err, data) => {
      if (err) {
        this.sendErr(err);
      } else {
        if (data === undefined) {
          this.sendErr(`the server ${Context} not exist`);
        } else {
          this.sendOk(data.msg);
        }
      }
    });
  }
}

module.exports = function(opts) {
  return new CommandSet(opts);
};


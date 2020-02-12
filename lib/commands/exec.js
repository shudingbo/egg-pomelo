'use strict';

const util = require('../util');
const consts = require('../consts');

const fs = require('fs');

const CommandBase = require('../commandBase');


class CommandExec extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'exec';
    this.helpCommand = 'help exec';
  }

  handle(comd, argv, msg) {

    const Context = this.getContext();
    if (Context === 'all') {
      this.sendErr('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
      return;
    }

    const argvs = util.argsFilter(argv);

    if (argvs.length > 2) {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    let file = null;
    if (comd[0] !== '/') {
      comd = process.cwd() + '/' + comd;
    }

    try {
      file = fs.readFileSync(comd).toString();
    } catch (e) {
      this.sendErr(consts.COMANDS_EXEC_ERROR);
      return;
    }

    this.cmdMgr.client.request('scripts', {
      command: 'run',
      serverId: Context,
      script: file,
    }, (err, msg) => {
      if (err) {
        this.sendErr(err);
      } else {
        if (msg === undefined) {
          this.sendErr(`the server ${Context} not exist`);
        } else {
          this.sendOk(msg);
        }
      }
    });
  }
}


module.exports = function(opts) {
  return new CommandExec(opts);
};


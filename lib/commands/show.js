
'use strict';

const util = require('../util');
const consts = require('../consts');

const CommandBase = require('../commandBase');


class Command extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'show';
    this.helpCommand = 'help show';
  }

  handle(comd, argv, msg) {
    const Context = this.getContext();
    const argvs = util.argsFilter(argv);
    let param = '';


    if (argvs.length > 2 && comd !== 'config') {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    if (argvs.length > 3 && comd === 'config') {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    if (argvs.length === 3 && comd === 'config') {
      param = argvs[2];
    }

    const user = msg.user || 'admin';


    if (Context === 'all' && consts.CONTEXT_COMMAND[comd]) {
      this.sendErr('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
      return;
    }

    if (!consts.SHOW_COMMAND[comd]) {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    this.cmdMgr.client.request('watchServer', {
      comd,
      param,
      context: Context,
    }, (err, data) => {
      if (err) {
        this.sendErr(err);
      } else {
        this.sendOk(data);
      }
    });
  }


}


module.exports = function(cmdMgr) {
  return new Command(cmdMgr);
};


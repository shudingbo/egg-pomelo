'use strict';

const util = require('../util');
const consts = require('../consts');

const CommandBase = require('../commandBase');


class CommandDisable extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'disable';
    this.helpCommand = 'help disable';
  }

  handle(comd, argv, msg) {
    const Context = this.getContext();
    if (Context === 'all') {
      this.sendErr('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
      return;
    }

    const argvs = util.argsFilter(argv);

    if (argvs.length > 3) {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    const param = argvs[2];

    if (comd === 'module') {
      this.sendErr('unsupport module');
      return;
      // this.cmdMgr.client.command(this.commandId, param, null, (err, data) => {
      //   if (err) {
      //     this.sendErr(err);
      //   } else {
      //     if (data === 1) {
      //       this.sendOk({ message: 'command ' + argv + ' ok' });
      //     }	else {
      //       this.sendErr('command ' + argv + ' bad');
      //     }
      //   }
      // });
    } else if (comd === 'app') {
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
            this.sendOk({ message: data });
          }
        }
      });
    } else {
      this.sendHelp(this.helpCommand, msg);
    }
  }
}

module.exports = function(opts) {
  return new CommandDisable(opts);
};


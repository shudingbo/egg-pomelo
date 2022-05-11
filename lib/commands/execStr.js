'use strict';

const consts = require('../consts');
const CommandBase = require('../commandBase');


class CommandExecStr extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'execStr';
    this.helpCommand = 'help execStr';
  }

  /**
   * @param {string} comd 命令
   * @param {string} argv 参数
   * @param {object} msg 消息
   */
  handle(comd, argv, msg) {

    const Context = this.getContext();
    if (Context === 'all') {
      this.sendErr('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
      return;
    }

    const script = argv.substr(8);
    if (script.length < 10) {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    let file = null;
    try {
      file = script;
    } catch (e) {
      this.sendErr(consts.COMANDS_EXECSTR_ERROR);
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
  return new CommandExecStr(opts);
};


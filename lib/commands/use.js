
let util = require('../util');
let consts = require('../consts');


module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'use';
module.exports.helpCommand = 'help use';

let Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {
	if (!comd) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	let Context = agent.getContext();
	let argvs = util.argsFilter(argv);

	if (argvs.length > 2) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	let user = msg['user'] || 'admin';

	if (comd === 'all') {
		util.log('\nswitch to server: ' + comd + '\n');
		Context = comd;
		agent.setContext(Context);
		let PROMPT = user + consts.PROMPT + Context + '>';
		rl.setPrompt(PROMPT);
		rl.prompt();
		return;
	}

	client.request('watchServer', {
		comd: 'servers',
		context: Context
	}, function(err, data) {
		if (err) console.log(err);
		else {
			let _msg = data['msg'];
			if (_msg[comd]) {
				util.log('\nswitch to server: ' + comd + '\n');
				Context = comd;
				agent.setContext(Context);
				let PROMPT = user + consts.PROMPT + Context + '>';
				rl.setPrompt(PROMPT);
			} else {
				util.log('\ncommand \'use ' + comd + '\' error for serverId ' + comd + ' not in pomelo clusters\n');
			}
		}
		rl.prompt();
	});
}
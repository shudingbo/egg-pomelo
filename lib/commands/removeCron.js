
let util = require('../util');
let consts = require('../consts');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'removeCron';
module.exports.helpCommand = 'help removeCron';

let Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {
	if (!comd) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	let argvs = util.argsFilter(argv);

	rl.question(consts.ADDCRON_QUESTION_INFO, function(answer) {
		if (answer === 'yes') {
			client.request(consts.CONSOLE_MODULE, {
				signal: 'removeCron',
				args: argvs.slice(1)
			}, function(err, data) {
				if (err) console.log(err);
				else util.formatOutput(comd, data);
				rl.prompt();
			});
		} else {
			rl.prompt();
		}
	});
}
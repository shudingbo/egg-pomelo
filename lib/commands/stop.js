
let util = require('../util');
let consts = require('../consts');


module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'stop';
module.exports.helpCommand = 'help stop';

let Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {
	if (!comd) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	let Context = agent.getContext();
	let argvs = util.argsFilter(argv);

	let ids = [];
	if (comd !== 'all') {
		ids = argvs.slice(1);
	}

	rl.question(consts.STOP_QUESTION_INFO, function(answer) {
		if (answer === 'yes') {
			client.request(consts.CONSOLE_MODULE, {
				signal: "stop",
				ids: ids
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
const sql = require('sqlite');
const request = require('request');
exports.run = (client, message, [person, account]) => {
	if (message.author.id !== "198466968725094400") return message.channel.send('You do not have permission to run that command.');
	let validAnswers = ['yes', 'y', 'no', 'n', 'Yes', 'No'];
	let yesAnswers = ['yes', 'y', 'Yes'];
	let noAnswers = ['no', 'n', 'No'];
	request.get(`https://api.mojang.com/users/profiles/minecraft/${account}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var uuid = JSON.parse(body).id;
            message.channel.send(`Is ${account} the account you wish to link up to ${person}? (yes/no)`).then(() => {
			message.channel.awaitMessages(m => m.author.id === message.author.id, {
				max: 1,
				time: 30000,
				errors: ['time'],
			})
			.then(collected => {
			if (!collected) return;
			if (collected.first().content === 'yes' || collected.first().content === 'y' || collected.first().content === 'Yes') {
				sql.open('./linkedaccounts.sqlite').then(() => sql.get(`SELECT * FROM linkedaccounts WHERE userId = '${person.id}'`).then(row => {
					if (!row) {
						sql.get(`SELECT * FROM linkedaccounts WHERE accountUuid = '${uuid}'`).then(row => {
							if (!row) {
								sql.run('INSERT INTO linkedaccounts (userId, accountUuid) VALUES (?, ?)', [person.id, uuid]).then(() => {
									message.channel.send(`Success! ${person}'s account has been linked to ${account}!`);
								});
							} else {
								message.channel.send(`That account is already linked to <@${userId}>!`)
							}
						})
					} else {
						if (row.accountUuid === uuid) {
							message.channel.send('You\'re already linked to that account!');
						} else {
							message.channel.send(`${person}'s account is already linked to ${row.accountUuid}! Please use \`p!forceunlink\` to unlink their account and then forcelink again!`);
					}
					}
				}).catch(() => {
					console.error;
					sql.run('CREATE TABLE IF NOT EXISTS linkedaccounts (userId TEXT, accountUuid TEXT)').then(() => {
						sql.run('INSERT INTO linkedaccounts (userId, accountUuid) VALUES (?, ?)', [person.id, uuid]).then(() => {
							message.channel.send(`Success! ${person}'s account has been linked to ${account}!`);
						});
					});
				}));
			} else if (collected.first().content === 'no' || collected.first().content === 'n' || collected.first().content === 'No') {
				message.channel.send('Cancelled.');
			} else {
				message.channel.send('Invalid reply!');
			};
		})
		.catch(() => {
			message.channel.send('Time limit exceeded, linkup cancelled.');
		});
		});
        } else {
            message.channel.send("That username does not exist!");
        }
	});
};

exports.conf = {
  enabled: true,
  selfbot: false,
  runIn: ["text", "group", "dm"],
  aliases: ["forcelinkaccount", "forcelink"],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  requiredModules: ["request", "sqlite"],
};

exports.help = {
  name: "forcelinkup",
  description: "Link somebody's Discord account to an MC account.",
  usage: "<person:member> <account:str>",
  usageDelim: " ",
  type: "commands"
};

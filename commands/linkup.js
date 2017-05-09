const sql = require('sqlite');
const request = require('request');
exports.run = (client, message, [account]) => {
	let validAnswers = ['yes', 'y', 'no', 'n', 'Yes', 'No'];
	let yesAnswers = ['yes', 'y', 'Yes'];
	let noAnswers = ['no', 'n', 'No'];
	request.get(`https://api.mojang.com/users/profiles/minecraft/${account}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var uuid = JSON.parse(body).id;
            message.channel.send(`Is ${account} the account you wish to link up? (yes/no)`).then(() => {
			message.channel.awaitMessages(m => m.author.id === message.author.id, {
				max: 1,
				time: 30000,
				errors: ['time'],
			})
			.then(collected => {
			if (!collected) return;
			// if(!validAnswers.includes(collected.content)) return message.channel.send('Invalid reply!');
			if (collected.first().content === 'yes' || collected.first().content === 'y' || collected.first().content === 'Yes') {
				// message.channel.send(`${uuid}`);
				sql.open('./linkedaccounts.sqlite').then(() => sql.get(`SELECT * FROM linkedaccounts WHERE userId = '${message.author.id}'`).then(row => {
					if (!row) {
						// console.log("INSERT INTO linkedaccounts (userId, accountUuid) VALUES (?, ?)', [message.author.id, uuid]).then(row => { message.reply(`${row.uuid}, new line`);");
						// sql.run('INSERT INTO linkedaccounts (userID, accountUuid) VALUES ("' + message.author.id + '", "' + uuid + '");').then(row => {
						sql.get(`SELECT * FROM linkedaccounts WHERE accountUuid = '${uuid}'`).then(row => {
							if (!row) {
								sql.run('INSERT INTO linkedaccounts (userId, accountUuid) VALUES (?, ?)', [message.author.id, uuid]).then(() => {
									message.channel.send(`Success! Your account has been linked to ${account}!`);
								});
							} else {
								message.channel.send(`That account is already linked to <@${row.userId}>!`)
							}
						});
					} else {
						if (row.accountUuid === uuid) {
							message.channel.send('You\'re already linked to that account!');
						} else {
						/*sql.run(`UPDATE linkedaccounts SET accountUuid = ${uuid} WHERE userId = '${message.author.id}'`).then(()=> {
							message.channel.send(`Success! Your account has been un-linked and linked to ${account}!`);
						});*/
						message.channel.send(`Your account is already linked to ${row.accountUuid}! Please use \`p!unlink\` to unlink your account and then link again!`);
					}
					}
				}).catch(() => {
					console.error;
					sql.run('CREATE TABLE IF NOT EXISTS linkedaccounts (userId TEXT, accountUuid TEXT)').then(() => {
						sql.run('INSERT INTO linkedaccounts (userId, accountUuid) VALUES (?, ?)', [message.author.id, uuid]).then(() => {
							message.channel.send(`Success! Your account has been linked to ${account}!`);
						});
					});
				}));
			} else if (collected.first().content === 'no' || collected.first().content === 'n' || collected.first().content === 'No') {
				message.channel.send('Cancelled.');
			} else {
				message.channel.send('Invalid reply!');
				// console.log(`"${collected.first().content}"`);
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
  aliases: ["linkaccount", "link"],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  requiredModules: ["request", "sqlite"],
};

exports.help = {
  name: "linkup",
  description: "Link your Discord account to an MC account.",
  usage: "<account:str>",
  usageDelim: " ",
  type: "commands"
};

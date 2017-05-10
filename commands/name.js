exports.run = (client, message, [uuid]) => {
  const request = require('request');
                        request.get(`https://api.mojang.com/user/profiles/${uuid}/names`, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var obj = JSON.parse(body);
                                var ret = "";
                                var current_name = obj[obj.length-1].name;

                                message.channel.send(`${uuid}'s username:`, {embed: {
                                    color: 3447003,
									author: {
										name: uuid,
										icon_url: `https://minotar.net/avatar/${current_name}/16`
									},
                                    description: current_name,
									timestamp: new Date(),
									footer: {
									icon_url: client.user.avatarURL,
									text: 'ThePoptartSquad\'s name lookup service'
                                }}});
							} else {
                message.channel.send("Sorry, that UUID does not exist!");
                console.log(`${error}::${response.statusCose}`);
              }
                        });
};

exports.conf = {
  enabled: true,
  selfbot: false,
  runIn: ["text", "group", "dm"],
  aliases: [],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  requiredModules: ["request"],
};

exports.help = {
  name: "name",
  description: "Get a player's name from their UUID",
  usage: "<uuid:str>",
  usageDelim: " ",
  type: "commands"
};

exports.run = (client, message, [name]) => {
  const request = require('request');
  // message.channel.send(`Getting previous names for ${name}!`);
  // message.channel.startTyping();

                request.get(`https://api.mojang.com/users/profiles/minecraft/${name}`, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var uuid = JSON.parse(body).id;
                                message.channel.send(`${name}'s UUID:`, {embed: {
                                    color: 3447003,
									author: {
										name: name,
										icon_url: `https://minotar.net/avatar/${name}/16`
									},
                                    description: uuid,
                                    // thumbnail: {url: `https://minotar.net/helm/${name}/100`},
									timestamp: new Date(),
									footer: {
									icon_url: client.user.avatarURL,
									text: 'ThePoptartSquad\'s UUID lookup service'
                                }}});
                    } else {
                        message.channel.send("Sorry, that username does not exist!");
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
  name: "uuid",
  description: "Get a player's UUID from their name",
  usage: "<name:str>",
  usageDelim: " ",
  type: "commands"
};

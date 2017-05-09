exports.run = (client, message, [name]) => {
  const request = require('request');
  // message.channel.send(`Getting previous names for ${name}!`);
  // message.channel.startTyping();

                request.get(`https://api.mojang.com/users/profiles/minecraft/${name}`, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var uuid = JSON.parse(body).id;

                        request.get(`https://api.mojang.com/user/profiles/${uuid}/names`, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var obj = JSON.parse(body);
                                var ret = "";

                                obj.forEach(function(element) {
                                    ret += `${element.name.replace(/_/g,"\\_")}\n`
                                });

                                message.channel.send(`${name}'s previous Minecraft usernames:`, {embed: {
                                    color: 3447003,
                                    description: ret,
                                    thumbnail: {url: `https://minotar.net/helm/${name}/100`},
									timestamp: new Date(),
									footer: {
									icon_url: client.user.avatarURL,
									text: 'ThePoptartSquad\'s name lookup service'
                                }}});
							}
                        });
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
  name: "names",
  description: "Get previous names for a player",
  usage: "<name:str>",
  usageDelim: " ",
  type: "commands"
};

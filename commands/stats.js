exports.run = (client, message, [ign, game]) => {
  const request = require('request');
  message.channel.send(`Getting stats for ${ign}!`);

            request.get(`http://hypixel.kerbybit.com/stats/${game}/${ign}.txt`, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.startsWith("Error: ")) {
                        message.reply(body);
                    } else {
                        var stats = body.substring(1, body.length-1).split(",");
                        var game = stats.shift();
                        var ret = "";

                        stats.forEach(function(stat) {
                            if (stat.includes(":")) {
                                stat = `**${stat.replace(":", ":**")}`;
                            } else if (stat != "") {
                                stat = `**${stat}**`;
                            }
                            ret += `${stat}\n`;
                        });

                        message.channel.send(`${ign}'s Hypixel stats for ${game}:`, {embed: {
                            color: 8602356,
                            description: ret,
                            thumbnail: {url: `https://minotar.net/helm/${ign}/100`}
                        }});
                    }
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
  name: "stats",
  description: "Get Hypixel stats for a player",
  usage: "<ign:str> <game:str>",
  usageDelim: " ",
  type: "commands"
};

const sql = require('sqlite');
const request = require('request');
exports.run = async (client, message, [member]) => {
  sql.open('./linkedaccounts.sqlite').then(() => sql.get(`SELECT * FROM linkedaccounts WHERE userId = '${member.id}'`).then(row => {
    if (!row) {
      message.channel.send('That user has not linked an account!');
    } else {
      request.get(`https://api.mojang.com/user/profiles/${row.accountUuid}/names`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var obj = JSON.parse(body);
          var ret = "";
          var current_name = obj[obj.length-1].name;

          message.channel.send(`${member}'s account:`, {embed: {
              color: 3447003,
              author: {
                name: current_name,
                icon_url: `https://minotar.net/avatar/${current_name}/16`
              },
              description: current_name,
              timestamp: new Date(),
              footer: {
                icon_url: client.user.avatarURL,
                text: 'ThePoptartSquad\'s name lookup service'
              }}});
        } else {
          message.channel.send('That user has an invalid account linked!');
        }
      });
  }
}));
}

exports.conf = {
  enabled: true,
  selfbot: false,
  runIn: ["text"],
  aliases: [],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  requiredModules: ["request", "sqlite"],
};

exports.help = {
  name: "whois",
  description: "test",
  usage: "<account:member>",
  usageDelim: " ",
  type: "commands"
};

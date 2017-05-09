const sql = require('sqlite');
const request = require('request');
exports.run = (client, message) => {
  sql.open('./linkedaccounts.sqlite').then(() => sql.get(`SELECT * FROM linkedaccounts WHERE userId = '${message.author.id}'`).then(row => {
    if (!row) {
      message.channel.send('You currently do not have an account linked! Link up with \`p!linkup <accountname>\` first!');
    } else {
      message.channel.send(`Are you sure you want to unlink your account? (yes/no)`).then(() => {
        message.channel.awaitMessages(m => m.author.id === message.author.id, {
          max: 1,
          time: 30000,
          errors: ['time'],
        }).then(collected => {
          if (!collected) return;
          if (collected.first().content === 'yes' || collected.first().content === 'y' || collected.first().content === 'Yes') {
            sql.run(`DELETE FROM linkedaccounts WHERE userId = '${message.author.id}'`, function(err) {
              if (error) console.log(error);
            }).then(() => {
              message.channel.send('Your account has been unlinked.');
            })
          } else if (collected.first().content === 'no' || collected.first().content === 'n' || collected.first().content === 'No') {
            message.channel.send('Cancelled.');
          } else {
            message.channel.send('Invalid reply!');
          }
        }).catch(() => {
          message.channel.send('Time limit exceeded, unlink cancelled.');
        })
      })
    }
  }))
};

exports.conf = {
  enabled: true,
  selfbot: false,
  runIn: ["text", "group", "dm"],
  aliases: ["unlinkaccount", "unlinkup"],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  requiredModules: ["request", "sqlite"],
};

exports.help = {
  name: "unlink",
  description: "Unlink your Discord account from your MC account.",
  usage: "",
  usageDelim: " ",
  type: "commands"
};

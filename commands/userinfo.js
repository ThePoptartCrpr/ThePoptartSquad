exports.run = (client, message, guild, params) => {
  let infoUser = message.guild.member(message.mentions.users.first()) || message.member;
  let nickname = infoUser.nickname;
  if (nickname === null) {
		nickname = "N/A";
	}
  message.channel.sendMessage(`Showing info for user ${infoUser} (${infoUser.user.username})\nJoined at: ${infoUser.joinedAt}\nNickname: ${nickname}\nAvatar: ${infoUser.user.displayAvatarURL}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['user'],
  permLevel: 0
};

exports.help = {
  name: 'userinfo',
  description: 'Prints information about the user you tagged.',
  usage: '+userinfo [@usertag]'
};

exports.conf = {
  enabled: true,
  selfbot: false,
  runIn: ["text"],
  aliases: [],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  requiredModules: [],
};

exports.help = {
  name: "userinfo",
  description: "Prints information about the user you tagged.",
  usage: "<infoUser:member>",
  usageDelim: " ",
  type: "commands"
};
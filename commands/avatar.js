const {MessageAttachment} = require('discord.js');

module.exports.run = async (bot, message, command, args, db) => {
    let user = message.mentions.users.first() || message.author;
    message.channel.send(new MessageAttachment(user.displayAvatarURL()));
}

module.exports.help = {
    name: 'avatar'
}
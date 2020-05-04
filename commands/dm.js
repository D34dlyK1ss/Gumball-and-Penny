let Discord = require('discord.js');

module.exports.run = async (bot, message, command, args, db) => {
    let mention = message.mentions.users.first();

    if (mention == null) {
        message.delete();
        message.reply("Não mencionaste ninguém!").then(msg => msg.delete(3000));
    }
    else {
        if (message.member.userID == message.guild.owner.userID) {
            let mentionMessage = message.content.slice(command.length + args[0].length + 2);
            message.delete();
            mention.send(mentionMessage);
        }
        else {
            message.delete();
            message.reply('não tens permissão para usar este comando! :anger:').then(msg => msg.delete(3000));
        }
    }
}

module.exports.help = {
    name: 'dm'
}

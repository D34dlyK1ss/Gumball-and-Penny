module.exports.run = async (bot, message, command, args, db) => {
    message.channel.send(`**${message.guild.name}** tem ${message.guild.memberCount} membros! :grin:`);
}

module.exports.help = {
    name: 'members'
}
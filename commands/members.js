module.exports.run = async (bot, message, command, args, db) => {
    message.channel.send(`**${message.guild.name}** tem **${message.guild.memberCount}** membros!`);
}

module.exports.help = {
    name: 'Members',
    category: "Diversos",
    description: "Mostraremos a quantidade de membros no servidor!",
    usage: "`+members`"
}
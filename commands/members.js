module.exports.run = async (bot, message, command, args, db) => {
    message.channel.send(`**${message.guild.name}** tem **${message.guild.memberCount}** membros!`);
}

module.exports.help = {
    name: 'members',
    category: "Servidor",
    description: "Mostraremos a quantidade de membros no servidor!",
    usage: "`+members`"
}
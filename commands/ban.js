module.exports.run = async (bot, message, command, args, db) => {
    message.delete();
    let mention = message.mentions.users.first();
    let member = message.guild.member(mention);
    if (!message.member.hasPermission('BAN_MEMBERS')) {
        message.reply('não tens permissão para usar este comando! :anger:').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
    }
    else {
        if (mention == null) {
            message.reply('tens de mencionar quem queres banir!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
        }
        else {
            member.ban().then((member) => {
                message.channel.send(`**${member.displayName}** foi banido! :hammer:`).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
            });
        }
    }
}

module.exports.help = {
    name: 'Ban',
    category: "Moderação",
    description: "Baniremos um membro do servidor!",
    usage: "`+ban [@utilizador]`"
}
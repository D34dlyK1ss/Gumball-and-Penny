module.exports.run = async (bot, message, command, args, db) => {
    message.delete();
    let mention = message.mentions.users.first();
    let member = message.guild.member(mention);
    if (!message.member.hasPermission('KICK_MEMBERS')) {
        message.reply('não tens permissão para usar este comando! :anger:').then(msg => msg.delete({ timeout: 3000 })).catch(err => { console.error(err) });
    }
    else {
        if (mention == null) {
            message.reply('tens de mencionar quem queres expulsar!').then(msg => msg.delete({ timeout: 3000 })).catch(err => { console.error(err) });
        }
        else {
            member.kick().then((member) => {
                message.channel.send(`**${member.displayName}** foi expulso! :wave:`).then(msg => msg.delete({ timeout: 3000 })).catch(err => { console.error(err) });
            });
        }
    }
}

module.exports.help = {
    name: 'kick'
}

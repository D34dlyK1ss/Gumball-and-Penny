module.exports = {
    name: 'kick',
    category: "Moderação",
    description: "Expulsaremos um membro do servidor!",
    usage: "`+kick [@utilizador]`",

    execute (message){
        message.delete();
        let mention = message.mentions.users.first();
        let member = message.guild.member(mention);
        if (!message.member.hasPermission('KICK_MEMBERS')) {
            message.reply('não tens permissão para usar este comando! 💢').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
        }
        else {
            if (mention == null) {
                message.reply('tens de mencionar quem queres expulsar!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
            }
            else {
                member.kick().then((member) => {
                    message.channel.send(`**${member.displayName}** foi expulso! 👋`).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
                });
            }
        }
    }
}

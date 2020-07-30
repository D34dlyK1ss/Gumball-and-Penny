module.exports = {
    name: 'ban',
    category: "Moderação",
    description: "Baniremos um membro do servidor!",
    usage: "`+ban [@utilizador]`",

    execute(message, args) {
        message.delete();
        let mention = message.mentions.users.first(),
            member = message.guild.member(mention);
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            message.reply('não tens permissão para usar este comando! 💢').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
        }
        else {
            if (mention == null) {
                message.reply('tens de mencionar quem queres banir!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
            }
            else {
                member.ban().then((member) => {
                    message.channel.send(`**${member.displayName}** foi banido! 🔨`).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
                });
            }
        }
    }
}
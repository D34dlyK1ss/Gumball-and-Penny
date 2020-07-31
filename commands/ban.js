const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    category: "Moderação",
    description: "Baniremos um membro do servidor!",
    usage: "`+ban [@utilizador]`",

    execute(bot, message, command, args, db) {
        message.delete();
        args.shift();
        let mention = message.mentions.users.first();
        let member = message.guild.member(mention),
            reason = args.join(' ');

        if (!message.member.hasPermission('BAN_MEMBERS')) {
            message.reply('não tens permissão para usar este comando! 💢').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
        }
        else {
            if (mention == null) {
                message.reply('tens de mencionar quem queres banir!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
            }
            else {
                member.ban({ reason: reason }).then((member) => {
                    if (reason == '') reason = '_Não indicada_';
                    const embed = new Discord.MessageEmbed()
                        .setColor('#8000ff')
                        .setTitle(`${member.user.tag} foi banido/a! 🔨`)
                        .setThumbnail(`${member.user.displayAvatarURL()}`)
                        .setDescription(`por ${message.member.user.tag}`)
                        .addFields(
                            { name: 'Razão', value: `${reason}` }
                        );

                    message.channel.send(embed);
                });
            }
        }
    }
}
module.exports = {
    name: 'clear',
    category: "Moderação",
    description: "Limpa o chat",
    usage: "`+clear [número]`",

    execute(bot, message, command, args, db) {
        message.delete();
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            message.reply(`não tens permissão para usar este comando! 💢`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(err => { console.error(err) });
        }
        else {
            if (args == '' || args == '0') {
                message.reply("tens de definir o número de mensagens que queres apagar!").then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
            }
            else {
                number = parseInt(args);
                if (number > 100) {
                    number = 100;
                }
                message.channel.bulkDelete(number, true).then(deleted => {
                    if (number == 1) {
                        message.channel.send("Apagámos `1` mensagem!").then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
                    }
                    else {
                        message.channel.send("Apagámos `" + deleted.size + "` mensagens!").then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
                    }
                })
            }
        }
    }
}
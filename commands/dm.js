module.exports.run = async (bot, message, command, args, db) => {
    let mention = message.mentions.users.first();
    let mentionMessage;
    if (mention == null) {
        message.delete();
        message.reply("Não mencnionaste ninguém!").then(msg => msg.delete(3000));
    }
    else {
        if (message.member.userID == 287953505992572929 || message.member.userID == 503009296267608066) {
            message.delete();
            let mention2 = String(mention);
            mentionMessage = message.content.slice(command.length + 21);
            mention.sendMessage(mentionMessage);
        }
        else {
            message.delete();
            message.reply(permfail).then(msg => msg.delete(3000));
        }
    }
}

module.exports.help = {
    name: 'dm'
}

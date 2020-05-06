module.exports.run = async (bot, message, command, args, db) => {
    message.delete();
    if (args[0].startsWith('http')) {
        message.channel.send("Não posso escrever links!").then(msg => msg.delete({ timeout: 3000 })).catch(err => { console.error(err) });
    }
    else {
        message.channel.send(args.join(' '));
    }
}

module.exports.help = {
    name: 'say'
}

module.exports.run = async (bot, message, command, args, db) => {
    message.channel.send('https://discord.com/oauth2/authorize?client_id=706141316446421053&scope=bot&permissions=8');
}

module.exports.help = {
    name: 'invite'
}
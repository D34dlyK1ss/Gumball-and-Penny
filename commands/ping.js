module.exports.run = async (bot, message, command, args, db) => {
  message.reply('Pong!');
}

module.exports.help = {
  name: 'ping',
  category: "Utilidade",
  description: "Uhm... pong?",
  usage: "`+ping`"
}

module.exports = {
  name: 'ping',
  category: "Utilidade",
  description: "Uhm... pong?",
  usage: "`+ping`",

  execute(bot, message, command, args, db) {
    message.reply('Pong!');
  }
}
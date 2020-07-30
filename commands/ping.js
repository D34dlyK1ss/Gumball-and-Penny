module.exports = {
  name: 'ping',
  category: "Utilidade",
  description: "Uhm... pong?",
  usage: "`+ping`",

  execute(message) {
    message.reply('Pong!');
  }
}
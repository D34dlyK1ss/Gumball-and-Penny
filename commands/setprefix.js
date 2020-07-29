module.exports.run = async (bot, message, command, args, db) => {
  if (!message.member.hasPermission('MANAGE_GUILD')) {
    message.delete();
    message.reply(`não tens permissão para usar este comando! 💢`).then(msg => { msg.delete({ timeout: 3000 }) }).catch(err => { console.error(err) });
  }
  else{
    if (args.length === 0){
      message.reply('precisamos de saber qual é o prefixo desejado!').then(msg => { msg.delete({ timeout: 3000 }) }).catch(err => { console.error(err) });
    }
    else {
      let newPrefix = args[0];
      db.collection('servidores').doc(message.guild.id).update({
        'prefix': newPrefix
      }).then(() => {
        message.channel.send('O prefixo para este servidor agora é `' + newPrefix + '`');
      }).catch(err => { console.error(err) });
    }
  }
}

module.exports.help = {
  name: 'setprefix',
  category: "Servidor",
  description: "Muda o nosso prefixo para este servidor",
  usage: "`+setprefix [prefixo]`"
}

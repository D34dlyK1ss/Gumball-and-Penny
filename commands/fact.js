module.exports.run = async (bot, message, command, args, db) => {
  var rnd = Math.floor(Math.random() * 7);
  if (message.member.id == 271737298951995393) {
    rnd = 0;
  }

  if (rnd == 0) {
    message.channel.send('Usada muitas vezes de forma excessiva, para algumas pessoas a palavra swag tem um significado diferente do normal: Secretly We Are Gay\nhttps://i.imgur.com/CoRrIKr.jpg');
  }

  if (rnd == 1) {
    message.channel.send('A soma de dois números idênticos é igual ao dobro de um deles. :nine: x :nine: = :nine: x :two:');
  }

  if (rnd == 2) {
    message.channel.send('Adolf Hitler foi um político alemão que serviu como líder do Partido Nazista, Chanceler do Reich e Führer da Alemanha Nazista desde 1934 até 1945. Como ditador do Reich Alemão, ele foi o principal instigador da Segunda Guerra Mundial e figura central do Holocausto.\nhttps://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hitler_portrait_crop.jpg/260px-Hitler_portrait_crop.jpg');
  }

  if (rnd == 3) {
    message.channel.send('Felix Arvid Ulf Kjellberg, mais conhecido por PewDiePie, é um youtuber sueco com o maior número subscritores no mundo.\nhttps://upload.wikimedia.org/wikipedia/commons/thumb/8/86/PewDiePie_at_PAX_2015_crop.jpg/220px-PewDiePie_at_PAX_2015_crop.jpg');
  }

  if (rnd == 4) {
    message.channel.send('A soma do valor dos lados opostos de um dado tradicional dá sempre a soma de 7. :game_die:');
  }

  if (rnd == 5) {
    message.channel.send('A cada 60 segundos em África, um minuto passa.\nhttps://s2.dmcdn.net/v/N3yL71REyTtHN8eYF/x1080');
  }

  if (rnd == 6) {
    message.channel.send('Ninguém morre por comer uma laranja à noite. :tangerine:');
  }
}

module.exports.help = {
  name: 'fact'
}

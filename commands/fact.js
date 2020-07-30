module.exports = {
  name: "fact",
  category: "Diversão",
  description: "**Factos**",
  usage: "`+fact`",

  execute(message) {
    var rnd = Math.round(Math.random() * 16);

    switch (rnd) {
      case 0:
        message.channel.send("Usada muitas vezes de forma excessiva, para algumas pessoas a palavra swag tem um significado diferente do normal: Secretly We Are Gay");
        break;
      case 1:
        message.channel.send("A soma de dois números idênticos é igual ao dobro de um deles. :nine: + :nine: = :nine: x :two:");
        break;
      case 2:
        message.channel.send("Adolf Hitler foi um político alemão que serviu como líder do Partido Nazista, Chanceler do Reich e Führer da Alemanha Nazista desde 1934 até 1945. Como ditador do Reich Alemão, ele foi o principal instigador da Segunda Guerra Mundial e figura central do Holocausto.");
        break;
      case 3:
        message.channel.send("Felix Arvid Ulf Kjellberg, mais conhecido por PewDiePie, é um youtuber sueco com o maior número subscritores no mundo.");
        break;
      case 4:
        message.channel.send("A soma do valor dos lados opostos de um dado tradicional dá sempre 7. 🎲");
        break;
      case 5:
        message.channel.send("A cada 60 segundos em África, um minuto passa.");
        break;
      case 6:
        message.channel.send("Ninguém morre por comer uma laranja à noite. 🍊");
        break;
      case 7:
        message.channel.send("2 + 2 = 4 - 1 = 3");
        break;
      case 8:
        message.channel.send("A maior parte dos grupos de K-Pop têm nomes ingleses para aumentar o marketing.");
        break;
      case 9:
        message.channel.send("O véu de casamento mais longo do mundo tem 7100 metros de comprimento e 180 centímetros de largura. 🤯");
        break;
      case 10:
        message.channel.send("O animal nacional da Escócia é unicórnio. 🦄");
        break;
      case 11:
        message.channel.send("M&M é uma sigla para Mars and Murrie. 🇲&🇲's");
        break;
      case 12:
        message.channel.send("A probabilidade de ter um Royal Straight Flush no Poker é de 1 em 649740, o equivalente a 0.000154%!");
        break;
      case 13:
        message.channel.send("A primeira _soft-drink_ a ir para o espaço foi a Coca-Cola.");
        break;
      case 14:
        message.channel.send("A unidade de medida da velocidade de um _mouse_ é o Mickey. 😂");
        break;
      case 15:
        message.channel.send("Cada garrafa de vinho tem cerca de 700 uvas. 🍷");
        break;
      case 16:
        message.channel.send("_All I Want for Christmas Is You_ de Mariah Carey é a música mais ouvida do Spotify. 🎶");
        break;
    }
  }
}
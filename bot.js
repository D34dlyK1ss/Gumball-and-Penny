const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const bot = new Discord.Client();

bot.on('ready', function (evt) {
    console.log('Preparados! ^^');
});

bot.on('message', function (user, userID, channelID, message, evt) {

    if (message.substring(0, 1) == '+') {
        var args = message.substring(1).split(' ');
        var command = args[0];
        var custom = '';
        var jojo = '';
        var last = '';
        
        args = args.splice(1);

        switch(command) {
            case 'commands':
                custom = args.join(" ");
                if (custom == '')
                {
                	message.channel.send('Todos os nossos comandos! :video_game:\n```\ncommands\nfact\ninvite\nping\nrandom\ssay\nwhichjojo```Para saberes mais sobre algum comando usa `+commands [nome do comando]`.\n\nP.S.:Existem uns quantos secretos :smiling_imp:');
                }
                else
                {
                    if (custom == 'commands')
                    {
                       message.channel.send('Se não sabes, soubesses! :unamused:');
                    }
                    
                    if (custom == 'invite')
                    {
                         message.channel.send('O `invite` mostra o link para nos convidares para um dos teus servidores!');
                    }
                    
                    if (custom == 'ping')
                    {
                        message.channel.send('Uhm... pong?');
                    }
                    
                    if (custom == 'random')
                    {
                         message.channel.send('Diremos um número aleatório entre 1 e o número indicado. O predefinido é 100');
                    }
                    
                    if (custom == 'say')
                    {
                         message.channel.send('O `say` faz um de nós dizer o que quiseres! :slight_smile:');
                    }
                    
                    if (custom == 'whichjojo')
                    {
                         message.channel.send("Com o `whichjojo` diremos qual JoJo de _JoJo's Bizarre Adventure_ és!");
                    }
                }
            break;
            case 'ping':
                custom = args.join(" ");
                 message.channel.send('Pong!');
            break;
            case 'fact':
                var rnd = Math.floor(Math.random() * 7);
                if (userID == 271737298951995393)
                {
                rnd = 0;
                }
                if (rnd == 0)
                {
                   message.channel.send('O Leandro é gay.\nhttps://i.imgur.com/CYTHGhZ.png');
                }
                if (rnd == 1)
                {
                   message.channel.send('A soma de dois números idênticos é igual ao dobro de um deles. :nine: x :nine: = :nine: x :two:');
                }
                if (rnd == 2)
                {
                   message.channel.send('Adolf Hitler foi um político alemão que serviu como líder do Partido Nazista, Chanceler do Reich e Führer da Alemanha Nazista desde 1934 até 1945. Como ditador do Reich Alemão, ele foi o principal instigador da Segunda Guerra Mundial e figura central do Holocausto.\nhttps://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hitler_portrait_crop.jpg/260px-Hitler_portrait_crop.jpg');
                }
                if (rnd == 3)
                {
                   message.channel.send('Felix Arvid Ulf Kjellberg, mais conhecido por PewDiePie, é um youtuber sueco com o maior número subscritores no mundo.\nhttps://upload.wikimedia.org/wikipedia/commons/thumb/8/86/PewDiePie_at_PAX_2015_crop.jpg/220px-PewDiePie_at_PAX_2015_crop.jpg');
                }
                if (rnd == 4)
                {
                   message.channel.send('A soma do valor dos lados opostos de um dado tradicional dá sempre a soma de 7. :game_die:');
                }
                if (rnd == 5)
                {
                   message.channel.send('A cada 60 segundos em África, um minuto passa.\nhttps://s2.dmcdn.net/v/N3yL71REyTtHN8eYF/x1080');
                }
                if (rnd == 6)
                {
                   message.channel.send('Ninguém morre por comer uma laranja à noite. :tangerine:');
                }
            break;
            case 'whichjojo':
                last = userID.slice(-1);
                if (last == 0)
                {
                  jojo = 'És o George Joestar I!\nhttps://vignette.wikia.nocookie.net/jjba/images/c/c6/George_Joestar_%28Anime%29.png';
                }
                if (last == 1)
                {
                  jojo = 'És a Jolyne Kujo!\nhttps://vignette.wikia.nocookie.net/jjba/images/3/3e/Jolyne_infobox_manga.jpg';
                }
                if (last == 2)
                {
                  jojo = 'És o Johnathan Joestar!\nhttps://vignette.wikia.nocookie.net/jjba/images/3/3f/JonathanP2.png';
                }
                if (last == 3)
                {
                  jojo = 'És o Johnny Joestar!\nhttps://vignette.wikia.nocookie.net/jjba/images/9/96/Johny_Joestar_profile.jpg';
                }
                if (last == 4)
                {
                  jojo = 'És o Josuke Higashikata!\nhttps://vignette.wikia.nocookie.net/jjba/images/d/d2/Jo2uke.png';
                }
                if (last == 5)
                {
                  jojo = 'És o George Joestar II!\nhttps://vignette.wikia.nocookie.net/jjba/images/9/92/George_Joestar_II_%28Anime%29.png';
                }
                if (last == 6)
                {
                  jojo = 'És o Josuke Higashikata!\nhttps://vignette.wikia.nocookie.net/jjba/images/2/24/JosukeAnime.PNG';
                }
                if (last == 7)
                {
                  jojo = 'És o Joseph Joestar!\nhttps://vignette.wikia.nocookie.net/jjba/images/e/e4/OldJosephAnime.png';
                }
                if (last == 8)
                {
                  jojo = 'És o Jotaro Kujo!\nhttps://vignette.wikia.nocookie.net/jjba/images/9/99/KujoAnime.png';
                }
                if (last == 9)
                {
                  jojo = 'És o Giorno Giovanna!\nhttps://vignette.wikia.nocookie.net/jjba/images/1/19/Giorno_Giovanna_Anime.png';
                }
                 message.channel.send(jojo);
            break;
            case 'invite':
                 message.channel.send('Convida-nos para o teu server! :grin:\nhttps://discordapp.com/oauth2/authorize?&client_id=679041548955942914&scope=bot&permissions=305523718');
            break;
            case 'say':
                custom = args.join(" ");
                message.channel.deleteMessage();
                message.channel.send(custom);
            break;
            case 'shine':
                message.channel.send('https://i.imgur.com/qSDP6OC.png')
            break;
            case 'boi':
                message.channel.send('https://i.imgur.com/5TQK5F3.png');
            break;
            case 'justmonika':
                message.channel.send('https://i.imgur.com/vpbnsDm.png');
            break;
            case 'nou':
                message.channel.send('https://i.imgur.com/O3WduAq.png');
            break;
            case 'e':
                message.channel.send('https://i.imgur.com/sHFZIi5.png');
            break;
            case 'hmm':
                message.channel.send('https://i.imgur.com/SP5VZVG.jpg');
            break;
            case 'random':
                custom = args.join(" ");
                if (custom == '')
                {
                    rnd = Math.floor(Math.random() * 100) + 1;
                }
                else
                {
                    rnd = Math.floor(Math.random() * custom) + 1;
                }
                message.channel.send(rnd + '!');
            break;
            case 'clear':
                custom = args.join(" ");
                message.channel.bulkDelete(custom).then(() => {
                    message.channel.send(custom + " mensagens foram apagadas!").then(msg => msg.delete(3000));
                });
            break;
         }
     }
});

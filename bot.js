var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {

    if (message.substring(0, 1) == '+') {
        var args = message.substring(1).split(' ');
        var command = args[0];
        var custom = '';
        var jojo = '';
        var last = '';
        var rnd = 0;
        
        args = args.splice(1);

        switch(command) {
            case 'commands':
                custom = args.join(" ");
                if (custom == '')
                {
                	bot.sendMessage({
                        to: channelID,
                        message: 'Todos os nossos comandos! :video_game:\n```\ncommands\nfact\ninvite\nping\nrandom\ssay\nwhichjojo```Para saberes mais sobre algum comando usa `+commands [nome do comando]`.\n\nP.S.:Existem uns quantos secretos :smiling_imp:'
                    })
                }
                else
                {
                    if (custom == 'commands')
                    {
                        bot.sendMessage({
                            to: channelID,
                            message: 'Se não sabes, soubesses! :unamused:'
                        })
                    }
                    
                    if (custom == 'invite')
                    {
                        bot.sendMessage({
                            to: channelID,
                            message: 'O `invite` mostra o link para nos convidares para um dos teus servidores!'
                        })
                    }
                    
                    if (custom == 'ping')
                    {
                        bot.sendMessage({
                            to: channelID,
                            message: 'Uhm... pong?'
                        })
                    }
                    
                    if (custom == 'random')
                    {
                        bot.sendMessage({
                            to: channelID,
                            message: 'Diremos um número aleatório entre 1 e o número indicado. O predefinido é 100'
                        })
                    }
                    
                    if (custom == 'say')
                    {
                        bot.sendMessage({
                            to: channelID,
                            message: 'O `say` faz um de nós dizer o que quiseres! :slight_smile:'
                        })
                    }
                    
                    if (custom == 'whichjojo')
                    {
                        bot.sendMessage({
                            to: channelID,
                            message: "Com o `whichjojo` diremos qual JoJo de _JoJo's Bizarre Adventure_ és!"
                        })
                    }
                }
            break;
            case 'ping':
                custom = args.join(" ");
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                })
            break;
            case 'fact':
                rnd = Math.floor(Math.random() * 7);
                if (userID == 271737298951995393)
                {
                rnd = 0;
                }
                if (rnd == 0)
                {
                  bot.sendMessage({
                    to: channelID,
                    message: 'O Leandro é gay.\nhttps://i.imgur.com/CYTHGhZ.png'
                  })
                }
                if (rnd == 1)
                {
                  bot.sendMessage({
                    to: channelID,
                    message: 'A soma de dois números idênticos é igual ao dobro de um deles. :nine: :heavy_plus_sign: :nine: = :nine: :heavy_multiplication_x: :two:'
                  })
                }
                if (rnd == 2)
                {
                  bot.sendMessage({
                    to: channelID,
                    message: 'Adolf Hitler foi um político alemão que serviu como líder do Partido Nazista, Chanceler do Reich e Führer da Alemanha Nazista desde 1934 até 1945. Como ditador do Reich Alemão, ele foi o principal instigador da Segunda Guerra Mundial e figura central do Holocausto.\nhttps://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hitler_portrait_crop.jpg/260px-Hitler_portrait_crop.jpg'
                  })
                }
                if (rnd == 3)
                {
                  bot.sendMessage({
                    to: channelID,
                    message: 'Felix Arvid Ulf Kjellberg, mais conhecido por PewDiePie, é um youtuber sueco com o maior número subscritores no mundo.\nhttps://upload.wikimedia.org/wikipedia/commons/thumb/8/86/PewDiePie_at_PAX_2015_crop.jpg/220px-PewDiePie_at_PAX_2015_crop.jpg'
                  })
                }
                if (rnd == 4)
                {
                  bot.sendMessage({
                    to: channelID,
                    message: 'A soma do valor dos lados opostos de um dado tradicional dá sempre a soma de 7. :game_die:'
                  })
                }
                if (rnd == 5)
                {
                  bot.sendMessage({
                    to: channelID,
                    message: 'A cada 60 segundos em África, um minuto passa.\nhttps://s2.dmcdn.net/v/N3yL71REyTtHN8eYF/x1080'
                  })
                }
                if (rnd == 6)
                {
                  bot.sendMessage({
                    to: channelID,
                    message: 'Ninguém morre por comer uma laranja à noite. :tangerine:'
                  })
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
                bot.sendMessage({
                    to: channelID,
                    message: jojo
                })
            break;
            case 'invite':
                bot.sendMessage({
                    to: channelID,
                    message: 'Convida-nos para o teu server! :grin:\nhttps://discordapp.com/oauth2/authorize?&client_id=679041548955942914&scope=bot&permissions=305523718'
                })
            break;
            case 'say':
                custom = args.join(" ");
                bot.deleteMessage({
                    channelID: channelID,
                    messageID: evt.d.id
                });
                bot.sendMessage({
                    to: channelID,
                    message: custom
                })
            break;
            case 'shine':
                custom = args.join(" ");
                bot.sendMessage({
                    to: channelID,
                    message: 'https://i.imgur.com/qSDP6OC.png'
                })
            break;
            case 'boi':
                custom = args.join(" ");
                bot.sendMessage({
                    to: channelID,
                    message: 'https://i.imgur.com/5TQK5F3.png'
                })
            break;
            case 'justmonika':
                custom = args.join(" ");
                bot.sendMessage({
                    to: channelID,
                    message: 'https://i.imgur.com/vpbnsDm.png'
                })
            break;
            case 'nou':
                custom = args.join(" ");
                bot.sendMessage({
                    to: channelID,
                    message: 'https://i.imgur.com/O3WduAq.png'
                })
            break;
            case 'e':
                custom = args.join(" ");
                bot.sendMessage({
                    to: channelID,
                    message: 'https://i.imgur.com/sHFZIi5.png'
                })
            break;
            case 'hmm':
                custom = args.join(" ");
                bot.sendMessage({
                    to: channelID,
                    message: 'https://i.imgur.com/SP5VZVG.jpg'
                })
            break;
            case 'random':
                custom = args.join(" ");
                if (custom == "")
                {
                    rnd = Math.floor(Math.random() * 100);
                    rnd++;
                }
                else
                {
                    rnd = Math.floor(Math.random() * custom);
                    rnd++;
                }
                bot.sendMessage({
                    to: channelID,
                    message: rnd'!'
                })
            break;
         }
     }
});

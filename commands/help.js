const Discord = require('discord.js');

module.exports = {
	name: 'help',
	aliases: ['h'],
	category: 'Ajuda',
	description: 'Se não sabes, soubesses! :unamused:',
	usage: 'help',

	execute(bot, message, command, args, db, prefix) {
		const { commands } = message.client,
			update = `**GRANDE UPDATE:** Agora temos um sistema de 'Pets'!
			Podes agora comprar um animal de estimação e até dar-lhe um nome!
			Explora a Loja Incrível e usa \`${prefix}pet\` para saberes mais`;
		const helpEmbed = new Discord.MessageEmbed()
			.setColor('#8000ff')
			.setTitle('Ajuda')
			.setAuthor(`${bot.user.tag}`, `${bot.user.displayAvatarURL()}`)
			.setThumbnail(`${bot.user.displayAvatarURL()}`)
			.setDescription(`Nós somos o Gumball e a Penny e temos como objetivo tornar qualquer servidor em que estamos num lugar divertido!
			Em caso de dúvida nalgum comando usa \`${prefix}help [nome do comando]\`
			${update}`)
			.addFields(
				{ name: '🎭 Ações', value: '`angry`, `cry`, `dance`, `hug`, `kiss`, `laugh`, `pat`, `run`, `slap`', inline: true },
				{ name: '🎰 Casino', value: '`coinflip`', inline: true },
				{ name: '😁 Diversão', value: '`fact`, `match`, `random`, `say`, `which`', inline: true },
				{ name: '💰 Economia e Perfil', value: '`balance`, `daily`, `give`, `inventory`, `pet`, `profile`, `shop`, `vote`', inline: true },
				{ name: '⚠️ Moderação', value: '`ban`, `clear`, `kick`, `mute`, `tempmute`, `unmute`', inline: true },
				{ name: '🌐 Servidor', value: '`members`, `serverinfo`, `setprefix`, `userinfo`', inline: true },
				{ name: '🛠️ Utilidade', value: '`avatar`, `invite`, `ping`', inline: true },
				{ name: '**Links**', value: '**[Convida-nos!](https://discordapp.com/oauth2/authorize?&client_id=679041548955942914&scope=bot&permissions=272100438) - [Servidor de Suporte](https://discord.com/invite/r249y37) - [Comprar VIP](https://ko-fi.com/officialgumballandpenny/commissions)**' },
			);

		if (args == null || args == '') {
			return message.channel.send(helpEmbed);
		}
		else {
			args = args.toString();
			const name = args.toLowerCase();
			command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {
				return message.reply('esse comando não existe!');
			}
			else {
				const commandEmbed = new Discord.MessageEmbed()
					.setColor('#8000ff')
					.addFields(
						{ name: 'Nome', value: `${command.name}` },
						{ name: 'Categoria', value: `${command.category}` },
						{ name: 'Como usar', value: `\`${prefix}${command.usage}\`` },
						{ name: 'Descrição', value: `${command.description}` },
					);

				if (!command.aliases) {
					return message.channel.send(commandEmbed);
				}
				else {
					const lastEmbed = commandEmbed;
					const newEmbed = new Discord.MessageEmbed(lastEmbed)
						.addFields(
							{ name: 'Abreviações', value: `${command.aliases.join(', ')}` },
						);

					message.channel.send(newEmbed);
				}
			}
		}
	},
};

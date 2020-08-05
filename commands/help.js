const Discord = require('discord.js');

module.exports = {
	name: 'help',
	aliases: ['h'],
	category: 'Ajuda',
	description: 'Se não sabes, soubesses! :unamused:',
	usage: '`+help`',

	execute(bot, message, command, args) {
		const { commands } = message.client,
			update = '**Update:** Sistema de leveling adicionado\nPor cada comando usado a cada minuto, XP será adicionado ao perfil.';
		const helpEmbed = new Discord.MessageEmbed()
			.setColor('#8000ff')
			.setTitle('Ajuda')
			.setAuthor('Gumball & Penny', `${bot.user.displayAvatarURL()}`)
			.setThumbnail(`${bot.user.displayAvatarURL()}`)
			.setDescription(`Nós somos o Gumball e a Penny e temos como objetivo tornar qualquer servidor em que estamos num lugar divertido!\nEm caso de dúvida nalgum comando usa \`+help [nome do comando]\`\n${update}`)
			.addFields(
				{ name: '🎭 Ações', value: '`hug`, `kiss`, `laugh`, `pat`, `run`, `slap`', inline: true },
				{ name: '🎰 Casino', value: '`coinflip`', inline: true },
				{ name: '😁 Diversão', value: '`fact`, `match`, `random`, `say`, `which`', inline: true },
				{name: '💰 Perfil', value: '`balance`, `daily`, `donate, `profile`', inline: true },
				{ name: '⚠️ Moderação', value: '`ban`, `clear`, `kick`', inline: true },
				{ name: '🌐 Servidor', value: '`members`, `setprefix`, `userinfo`', inline: true },
				{ name: '🛠️ Utilidade', value: '`avatar`, `invite`, `ping`', inline: true },
			);

		if (args == null || args == '') {
			message.channel.send(helpEmbed);
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
						{ name: 'Como usar', value: `${command.usage}` },
						{ name: 'Descrição', value: `${command.description}` },
					);

				if (!command.aliases) {
					message.channel.send(commandEmbed);
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
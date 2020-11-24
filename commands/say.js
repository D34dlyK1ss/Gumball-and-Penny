module.exports = {
	name: 'say',
	category: 'Diversão',
	description: 'Isso faz um de nós dizer o que quiseres! :slight_smile:',
	usage: 'say [mensagem]',

	execute(bot, message, command, args) {
		message.delete();
		if (args == null || args == '') {
			return message.reply('não escreveste nada!').then(msg => msg.delete({ timeout: 5000 })).catch();
		}
		else if (args[0].startsWith('http')) {
			return message.reply('não podemos escrever links!').then(msg => msg.delete({ timeout: 5000 })).catch();
		}
		else {
			message.channel.send(args.join(' ')).catch();
		}
	},
};

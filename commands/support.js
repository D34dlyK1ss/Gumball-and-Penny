module.exports = {
	name: 'invite',
	category: 'Utilidade',
	description: 'Enviaremos o link para o nosso servidor de suporte!',
	usage: '`+invite`',

	execute(bot, message) {
		message.channel.send('Tens alguma dúvida ou quere dar alguma ideia para nós? Aqui tens o link para o nosso servidor de suporte 👇\nhttps://discord.com/invite/8DwZCfj');
	},
};
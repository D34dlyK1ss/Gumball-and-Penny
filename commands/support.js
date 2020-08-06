module.exports = {
	name: 'support',
	category: 'Utilidade',
	description: 'O link para o nosso servidor de suporte!',
	usage: '`+support`',

	execute(bot, message) {
		message.channel.send('Tens alguma dúvida ou queres dar alguma ideia para nós? Aqui tens o link para o nosso servidor de suporte 👇\nhttps://discord.com/invite/8DwZCfj');
	},
};
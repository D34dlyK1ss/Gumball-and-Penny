module.exports = {
	name: 'fact',
	category: 'Fun',
	description: '** Facts **',
	usage: 'fact',

	execute(bot, message) {
		const rnd = Math.round (Math.random () * 16);

		switch (rnd) {
		case 0:
			message.channel.send ('Too often used, for some people a word swag has a different meaning than normal: Secretly We Are Gay');
			break;
		case 1:
			message.channel.send ('The sum of two identical numbers is equal to double one: nine: +: nine: =: nine: x: two:');
			break;
		case 2:
			message.channel.send ('Adolf Hitler was a German politician who served as leader of the Nazi Party, Chancellor of the Reich and Führer of Nazi Germany from 1934 to 1945. As dictator of the German Reich, he was the main instigator of World War II and central figure of the Holocaust. ');
			break;
		case 3:
			message.channel.send ('Felix Arvid Ulf Kjellberg, better known as PewDiePie, is a Swedish youtuber with the largest number of subscribers in the world.');
			break;
		case 4:
			message.channel.send ('The sum of the value of the opposite sides of a traditional die always gives 7. 🎲');
			break;
		case 5:
			message.channel.send ('Every 60 seconds in Africa, one minute passes.');
			break;
		case 6:
			message.channel.send ('Nobody dies from eating an orange at night. 🍊');
			break;
		case 7:
			message.channel.send ('2 + 2 = 4 - 1 = 3');
			break;
		case 8:
			message.channel.send ('Most K-Pop groups have English names to increase marketing.');
			break;
		case 9:
			message.channel.send ('The longest wedding veil in the world is 7100 meters long and 180 centimeters wide. 🤯');
			break;
		case 10:
			message.channel.send ('Scotland\'s national animal is a unicorn. 🦄');
			break;
		case 11:
			message.channel.send ('M&M is an acronym for Mars and Murrie. 🇲&🇲\'s');
			break;
		case 12:
			message.channel.send ('The probability of having a Royal Straight Flush on Poker is 1 in 649740, equivalent to 0.000154%!');
			break;
		case 13:
			message.channel.send ('A first refreshment_ to go to space was Coca-Cola.');
			break;
		case 14:
			message.channel.send ('The unit speed\'s measurement of a _mouse_ is Mickey. 😂');
			break;
		case 15:
			message.channel.send ('Each bottle of wine has about 700 grapes. 🍷');
			break;
		case 16:
			message.channel.send ('_I only want at Christmas_ by Mariah Carey is the most heard song on Spotify. 🎶');
			break;
		}
	},
};
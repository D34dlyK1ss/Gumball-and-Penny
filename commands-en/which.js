module.exports = {
	name: 'which',
	aliases: ['w'],
	category: 'Fun',
	description: 'With this command you can know which anime character you are!\nAvailable anime: `akame ga kill`, `code geass`, `death note`, `higurashi` , `jojo`, `kakegurui`, `mirai nikki`, `noragami`, `one punch man`, `psycho-pass`, `steins;gate`',
	usage: 'which [anime]',

	execute(bot, message, command, args) {
		args = args.join(' ');
		args = args.toLowerCase();
		const last = message.member.id.slice(-1);
		let char = [];

		if (args == null || args == '') {
			return message.reply('you gotta select an anime! Usa `+help which` for more information.');
		}
		else {
			switch (last) {
			case '0':
				char = ['George Joestar I', 'Teru Mikami', 'Mine', 'Mumen Rider', 'Euphemia li Britannia', 'Yumemi Yumemite', 'Ebisu', 'Deus Ex Machina', 'Moeka Kiryuu', 'Rika Furude', 'KiritKamui'];
				break;
			case '1':
				char = ['Jolyne Kujo', 'Mihael Keehl', 'Bulat', 'King', 'Xingke Li', 'Kaede Manyuda', 'Daikoku', 'Aru Akise', 'RumihAkiha', 'Rena Ryuuguu', 'Tomomi Masaoka'];
				break;
			case '2':
				char = ['JotarKujo', 'L', 'Tatsumi', 'Genos', 'Suzaku Kururugi', 'Ryouta Suzui', 'Yato', 'KeigKurusu', 'Itaru Hashida', 'Keiichi Maebara', 'Nobuchika Ginoza'];
				break;
			case '3':
				char = ['Johnny Joestar', 'Touta Matsuda', 'Chelsea', 'Speed-o\'-Sound Sonic', 'Kaname Ougi', 'Mary Saotome', 'Nora', 'Yomotsu Hirasaka', 'Ruka Urushibara', 'MiyTakano', 'Joushuu Kasei'];
				break;
			case '4':
				char = ['Josuke Higashikata!', 'Rem', 'Lubbock', 'Puri-Puri Prisoner', 'Cornelia li Britannia', 'Ririka Momobami', 'Tenjin', 'Tsubaki Kasugano', 'MahHiyajou', 'Ooishi Kuraudo', 'Yayoi Kunizuka'];
				break;
			case '5':
				char = ['George Joestar II!', 'Naomi Misora', 'Akame', 'Bang', 'Nunnally vi Britannia', 'YumekJabami', 'Kazuma', 'Yukiteru Amano', 'YuugTennouji', 'Shion Sonozaki', 'Shuusei Kagari'];
				break;
			case '6':
				char = ['Josuke Higashikata', 'Ryuk', 'Najenda', 'Tatsumaki', 'Shirley Fenette', 'Runa Yomozuki', 'Yukine', 'YunGasai', 'Mayuri Shiina', 'Hanyuu', 'Akane Tsunemori'];
				break;
			case '7':
				char = ['Joseph Joestar', 'Nate River', 'Esdeath', 'Garou', 'Kallen Stadtfeld', 'Itsuki Sumeragi', 'Kofuku', 'Hinata Hino', 'Suzuha Amane', 'SatokHoujou', 'ShougMakishima'];
				break;
			case '8':
				char = ['Johnathan Joestar', 'Misa Amane', 'Leone', 'Fubuki', 'C.C.', 'Kirari Momobami', 'Hiyori Iki', 'Muru Muru', 'Kurisu Makise', 'Mion Sonozaki', 'Shion Karanomori'];
				break;
			case '9':
				char = ['GiornGiovanna', 'Light Yagami!', 'Sheele', 'Saitama', 'Lelouch vi Britannia', 'Midari Ikishima', 'Bishamon', 'Minene Uryuu', 'Rintarou Okabe', 'Mamoru Akasaka', 'Shinya Kougami'];
				break;
			}

			switch (args) {
			case 'jojo':
				message.channel.send(`You are ${char[0]}!`, { files: [`images/which/${args} (${last}).jpg`] });
				break;
			case 'death note':
				message.channel.send(`You are ${char[1]}!`, { files: [`images/which/${args} (${last}).jpg`] });
				break;
			case 'akame ga kill':
				message.channel.send(`You are ${char[2]}!`, { files: [`images/which/${args} (${last}).jpg`] });
				break;
			case 'one punch man':
				message.channel.send(`You are ${char[3]}!`, { files: [`images/which/${args} (${last}).jpg`] });
				break;
			case 'code geass':
				message.channel.send(`You are ${char[4]}!`, { files: [`images/which/${args} (${last}).jpg`] });
				break;
			case 'kakegurui':
				message.channel.send(`You are ${char[5]}!`, { files: [`images/which/${args} (${last}).jpg`] });
				break;
			case 'noragami':
				message.channel.send(`You are ${char[6]}!`, { files: [`images/which/${args} (${last}).jpg`] });
				break;
			case 'mirai nikki':
				message.channel.send(`You are ${char[7]}!`, { files: [`images/which/${args} (${last}).jpg`] });
				break;
			case 'steins;gate':
				message.channel.send(`You are ${char[8]}!`, { files: [`images/which/${args} (${last}).jpg`] });
				break;
			case 'higurashi':
				message.channel.send(`You are ${char[9]}!`, { files: [`images/which/${args} (${last}).jpg`] });
				break;
			case 'psycho-pass':
				message.channel.send(`You are ${char[10]}!`, { files: [`images/which/${args} (${last}).jpg`] });
				break;
			}
		}
	},
};
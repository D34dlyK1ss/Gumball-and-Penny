const { MessageAttachment } = require('discord.js');
const { registerFont, createCanvas, loadImage } = require('canvas');
const items = require('../itemlist.json');
registerFont('./fonts/comic.ttf', { family: 'Comic Sans MS' });
registerFont('./fonts/comicb.ttf', { family: 'bold Comic Sans MS' });
registerFont('./fonts/comici.ttf', { family: 'italic Comic Sans MS' });
registerFont('./fonts/comicz.ttf', { family: 'bold-italic Sans MS' });

function titleCase(str) {
	const splitStr = str.toLowerCase().split(' ');
	for (let i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(' ');
}

module.exports = {
	name: 'pet',
	category: 'Economia e Perfil',
	description: 'Vê o teu pet ou o de alguém!\nOpções disponíveis: `sendtoadoption`, `sethud`, `setname`',
	usage: 'pet [opcional - opção | @membro]',

	execute(bot, message, command, args, db, prefix) {
		const user = message.mentions.users.first() || message.author,
			refV = db.collection('vip').doc(user.id),
			refP = db.collection('pet').doc(user.id),
			refI = db.collection('inventario').doc(message.author.id),
			option = args[0];
		args = args.slice(1);
		args = args.join(' ');

		switch (option) {
		case 'setname':
			db.collection('pet').doc(message.author.id).get().then(doc => {
				if (!doc.exists) {
					return message.reply(`ainda não compraste um pet! Para comprares um vai à Loja Incrível usando \`${prefix}shop pets\`!`);
				}
				else if (items.pets[doc.get('pet')].vip) {
					return message.reply(`não podes mudar o nome de **${titleCase(doc.get('pet'))}**!`);
				}
				else {
					refI.get().then(docI => {
						const invItems = docI.get('items'),
							newName = titleCase(args);
						if (!invItems.includes('name_license')) {
							return message.reply('não tens uma **Licença de Nome**!');
						}
						else if (!newName || newName == '') {
							return message.reply('não escolheste nome nenhum!');
						}
						else if (newName == doc.get('name')) {
							return message.reply('o teu pet já tem esse nome!');
						}
						else if (args.length > 24) {
							return message.reply(`o limite máximo de caracteres para o nome é de 24!\nEssa alcunha tem ${args.length}.`);
						}
						else {
							invItems.splice(invItems.findIndex(item => item == 'name_license'), 1);
							refI.update({
								items: invItems,
							});

							db.collection('pet').doc(message.author.id).update({
								name: newName,
							}).then(() => {
								message.reply(`o nome do teu pet foi alterado para ${newName}!`);
							}).catch(err => { console.error(err); });
						}
					});
				}
			});
			break;
		case 'sethud':
			db.collection('pet').doc(message.author.id).get().then(docP => {
				if (!docP.exists) {
					if (user == message.author) {
						return message.reply(`ainda não compraste um pet! Para comprares um vai à Loja Incrível usando \`${prefix}shop pets\`!`);
					}
				}
				else {
					refI.get().then(docI => {
						const petHuds = docI.get('petHuds');
						let newHud = '';

						newHud = newHud.concat(args.slice(0)).toLowerCase().replace(/[ ]/g, '_');

						if (!newHud || newHud == '') {
							return message.reply('não escolheste um HUD!');
						}
						else if (!petHuds.includes(`${newHud}`)) {
							return message.reply('não tens esse HUD!');
						}
						else {
							db.collection('pet').doc(message.author.id).update({
								hud: newHud,
							}).then(() => {
								message.reply(`alteraste o teu HUD para **${titleCase(args)}**`);
							}).catch(err => { console.error(err); });
						}
					});
				}
			});
			break;
		case 'sendtoadoption':
			db.collection('pet').doc(message.author.id).get().then(docP => {
				if (!docP.exists) {
					if (user == message.author) {
						return message.reply('não tens pet nenhum para dar para adoção!');
					}
				}
				else {
					let petName = docP.get('name'),
						gender = docP.get('gender'),
						pronoun;
					const pet = docP.get('pet');
					const petVIP = items.pets[pet].vip;
					if (petName == '') petName = `${(docP.get('species')).toLowerCase()}`;
					gender == '♂️' ? (petVIP ? pronoun = 'o' : pronoun = 'o teu') : (petVIP ? pronoun = 'a' : pronoun = 'a tua');
					gender == '♂️' ? gender = 'o' : gender = 'a';
					db.collection('pet').doc(message.author.id).delete().then(async () => {
						if (petVIP) {
							refI.get().then(docI => {
								const iPetHUDs = docI.get('petHuds');
								iPetHUDs.splice(iPetHUDs.findIndex(petHud => petHud == `${pet}`), 1);
							});
						}
						await message.reply(`${pronoun} **${petName}** foi dad${gender} para adoção!`);
					});
				}
			});
			break;
		default:
			refP.get().then(async doc => {
				if (!doc.exists) {
					if (user == message.author) {
						return message.reply(`ainda não compraste um pet! Para comprares um vai à Loja Incrível usando \`${prefix}shop pets\`!`);
					}
					else if (user == bot.user) {
						return message.reply('nós não temos um pet!');
					}
					else if (user.bot) {
						return message.reply('os bots não têm pets! 😂 ');
					}
					else {
						return message.reply(`${user.tag} ainda não comprou um pet!`);
					}
				}
				else {
					const pet = doc.get('pet'),
						petName = doc.get('name'),
						petSpecies = doc.get('species'),
						petNature = doc.get('nature'),
						petHud = doc.get('hud');

					const canvas = createCanvas(617, 327),
						ctx = canvas.getContext('2d');

					const bg = await loadImage(`images/pet/hud_pet (${petHud}).png`);
					ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

					ctx.beginPath();

					ctx.globalAlpha = 1;

					ctx.save();

					ctx.font = '18px Comic Sans MS';
					ctx.shadowColor = 'black';
					ctx.shadowBlur = 3;
					ctx.shadowOffsetX = 3;
					ctx.shadowOffsetY = 3;
					ctx.fillStyle = 'white';

					const extra = 40;
					ctx.fillText(`Nome: ${petName}`, 330, 125 + extra);
					ctx.fillText(`Espécie: ${petSpecies}`, 330, 155 + extra);
					ctx.fillText(`Natureza: ${petNature}`, 330, 185 + extra);

					ctx.restore();

					ctx.closePath();


					const petPic = await loadImage(`./images/pet/${pet}.png`);
					ctx.drawImage (petPic, 160, 120);

					ctx.beginPath();
					ctx.arc(97, 70, 58, 0, Math.PI * 2, true);
					ctx.lineWidth = 6;
					ctx.strokeStyle = 'white';
					ctx.stroke();
					ctx.closePath();

					refV.get().then(async docV => {

						if (docV.exists) {
							const crown = await loadImage('./images/profile/crown.png');
							ctx.drawImage (crown, 7, 12, 50, 50);
						}

						const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));
						ctx.clip();
						ctx.drawImage (avatar, 37, 10, 120, 120);

						const attachment = new MessageAttachment(canvas.toBuffer(), 'pet.png');

						await message.channel.send(attachment);
					});
				}
			});
			break;
		}
	},
};
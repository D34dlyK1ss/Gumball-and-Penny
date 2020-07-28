const Discord = require('discord.js');

module.exports.run = async (bot, message, command, args, db) => {
    let user = message.mentions.users.first() || message.author,
        member = message.guild.member(user),
        ref = db.collection('perfis').doc(user.id),
        option = args[0];
    args = args.slice(1);
    args = args.join(" ");

    switch (option){
        case 'create':
            db.collection('perfis').doc(user.id).set({
                'balance': 0,
                'description': 'N/A',
                'id': user.id,
                'name': user.username
            }).then(() => {message.reply('o teu perfil foi criado! Adiciona uma descricão com `+profile setdescription [descrição]`!')});
        break;
        case 'setdescription':
            db.collection('perfis').doc(user.id).update({
                'description': args
            }).then(() => {
                message.reply('a tua descrição foi alterada!');
            }).catch(err => { console.error(err) });
        break;
        default:
            ref.get().then(doc => {
                if (!doc.exists) {
                    if (user == message.author){
                        message.channel.send("Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!");
                    }
                    else {
                        message.channel.send("Este utilizador ainda não criou um perfil!");
                    }
                }
                else {
                    let desc = doc.get("description"),
                        bal = doc.get("balance");
                    const embed = new Discord.MessageEmbed()
                        .setColor('#8000ff')
                        .setAuthor(`${user.tag}`, `${user.displayAvatarURL()}`)
                        .setThumbnail(`${user.displayAvatarURL()}`)
                        .addFields(
                            { name: 'Descrição', value: `${desc}`},
                            { name: 'Capital', value: `¤${bal}`},
                        )

                    message.channel.send(embed);
                }
            })
        break;
    }
}

module.exports.help = {
    name: 'profile',
    category: "Diversos",
    description: "Vê o teu perfil ou o de alguém!",
    usage: "`+profile [opcional - @utilizador]`"
}
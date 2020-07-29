module.exports.run = async (bot, message, command, args, db) => {
    let user = message.author,
        ref = db.collection('perfis').doc(user.id);

    ref.get().then(doc => {
        let now = new Date(),
            lastdaily = doc.get("lastDaily").toDate(),
            timepassed = now - lastdaily;
        if (!doc.exists) {
            message.channel.send("Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!");
        }
        else if (timepassed < 86400000){
            message.channel.send("Ainda não passaram 24 horas desde o teu último `+daily`!");
        }
        else {
            let bal = doc.get("balance");

            db.collection('perfis').doc(user.id).update({
                'balance': (bal + 250),
                'lastDaily': new Date()
            }).then(() => {
                message.channel.send('Recebeste os teus ¤250 diários!');
            }).catch(err => { console.error(err) });
        }
    }).catch(err => { console.error(err) });
}

module.exports.help = {
    name: 'daily',
    category: "Economia",
    description: "Receberás ¤250 a cada 24 horas!",
    usage: "`+daily`"
}

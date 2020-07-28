module.exports.run = async (bot, message, command, args, db) => {
    let user = message.author,
        ref = db.collection('perfis').doc(user.id);

    ref.get().then(doc => {
        if (!doc.exists) {
            message.channel.send("Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!");
        }
        else {
            let bal = doc.get("balance");

            message.channel.send(`Tens ¤${bal}`);
        }
    })
}

module.exports.help = {
    name: 'balance',
    category: "Economia",
    description: "Verifica o teu capital!",
    usage: "`+balance`"
}

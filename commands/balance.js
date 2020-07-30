module.exports = {
    name: 'balance',
    category: "Economia",
    description: "Verifica o teu capital!",
    usage: "`+balance`",

    execute(message, db) {
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
        }).catch(err => { console.error(err) });
    }
}

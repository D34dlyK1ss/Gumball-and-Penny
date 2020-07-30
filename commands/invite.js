module.exports = {
    name: 'invite',
    category: "Utilidade",
    description: "Enviaremos o link para nos convidares para um servidor!",
    usage: "`+invite`",

    execute(message) {
        message.channel.send('Convida-nos para o teu server! :grin:\nhttps://discordapp.com/oauth2/authorize?&client_id=679041548955942914&scope=bot&permissions=37088326');
    }
}
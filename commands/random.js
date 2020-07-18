module.exports.run = async (bot, message, command, args, db) => {
    let rnd;
    if (args == '') {
        rnd = Math.floor(Math.random() * 100) + 1;
    }
    else {
        rnd = Math.floor(Math.random() * args) + 1;
    }
    message.channel.send(`${rnd}!`);
}

module.exports.help = {
    name: 'Random',
    category: "Diversão",
    description: "Diremos um número aleatório entre 1 e o número indicado. O predefinido é 100",
    usage: "`+random [opcional - número]`"
}

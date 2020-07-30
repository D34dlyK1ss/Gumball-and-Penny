module.exports = {
    name: 'say',
    category: "Diversão",
    description: "Isso faz um de nós dizer o que quiseres! :slight_smile:",
    usage: "`+say [mensagem]`",

    execute (message, args){
        message.delete();
        if (args == null || args == '') {
            message.reply("Não escreste nada!").then(msg => msg.delete({ timeout: 5000 }));
        }
        else if (args[0].startsWith('http')) {
            message.channel.send("Não podemos escrever links!").then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err) });
        }
        else {
            message.channel.send(args.join(' '));
        }
    }
}

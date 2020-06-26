var request = require('request');

module.exports.run = async (bot, message, command, args, db) => {
    args = args.toString();
    if (args == '' || args == null){
        message.channel.send('É necessário mencionar o país!');
    }
    else if (args.length == 2){
        args = args.toUpperCase();
        var options = {
            'method': 'GET',
            'url': 'https://api.covid19api.com/summary',
            'headers': {
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });
    }
}

module.exports.help = {
    name: 'covid'
}
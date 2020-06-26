var request = require('request');

module.exports.run = async (bot, message, command, args, db) => {
    args = args.toString();
    if (args == '' || args == null){
        message.channel.send('É necessário mencionar o país!');
    }
    else {
        args = args.toUpperCase();
        var options = {
            'method': 'GET',
            'url': `https://api.covid19api.com/country/${args}?from=2020-06-24T23:59:59Z&to=2020-06-25T00:00:00Z`,
            'headers': {
            }
        };
        
        request(options, function (error, response) {
            if (error) throw new Error(error);
            message.channel.send(response.body);
        });
    }
}

module.exports.help = {
    name: 'covid'
}
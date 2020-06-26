var request = require('request');

module.exports.run = async (bot, message, command, args, db) => {
    let today = new Date().toJSON().slice(0, 10);
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let dd = String(yesterday.getDate()).padStart(2, '0');
    let mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = yesterday.getFullYear();

    yesterday = yyyy + '-' + mm + '-' + dd;

    args = args.toString();
    if (args == '' || args == null){
        message.channel.send('É necessário mencionar o país!');
    }
    else {
        args = args.toUpperCase();
        var options = {
            'method': 'GET',
            'url': `https://api.covid19api.com/country/${args}?from=${yesterday.toString}&to=${today.toString}`,
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
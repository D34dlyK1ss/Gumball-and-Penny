var request = require('request');

module.exports.run = async (bot, message, command, args, db) => {
    let today = new Date().toJSON().slice(0, 10);
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let dd = String(yesterday.getDate()).padStart(2, '0');
    let mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = yesterday.getFullYear();

    yesterday = yyyy + '-' + mm + '-' + dd;

    today = today.toString();

    args = args.join("-");
    args = args.toString().toLowerCase();

    if (args == '' || args == null){
        message.channel.send('É necessário mencionar o país!');
    }
    else {
        var options = {
            'method': 'GET',
            'url': `https://api.covid19api.com/country/${args}?from=${yesterday}&to=${today}`,
            'headers': {
            }
        };
        
        request(options, function (error, response) {
            if (error) console.log(error);
            else if (response.body.startsWith('{') || response.body.startsWith('"')){
                message.channel.send('Esse país não existe!').catch(err => { console.log(err) });
            }
            else {
                let info = JSON.parse(response.body.toString());
                let filterArray = ["Country", "Confirmed", "Deaths", "Recovered", "Active", "Date"];
                let res = [];
                for (var i = 0; i < res.length; i++) {
                    for (var filterItem in filterArray) {
                        res.push(info[i][filterArray[filterItem]]);
                    }
                }
            }

        });
    }
}

module.exports.help = {
    name: 'covid'
}
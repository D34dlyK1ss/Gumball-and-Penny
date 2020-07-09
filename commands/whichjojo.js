module.exports.run = async (bot, message, command, args, db) => {
  let last = message.member.id.slice(-1);
  let jojo = '';

  if (last == 0) {
    jojo = 'És o George Joestar I! - "わたしの名はジョースター。"';
  }
  if (last == 1) {
    jojo = 'És a Jolyne Kujo! - "やれやれだわ。"';
  }
  if (last == 2) {
    jojo = 'És o 'És o Jotaro Kujo! - "やれやれだぜ。"'';
  }
  if (last == 3) {
    jojo = 'És o Johnny Joestar! - "家に帰りましょう。。。"';
  }
  if (last == 4) {
    jojo = 'És o Josuke Higashikata! - "ぼくは一体何？！"';
  }
  if (last == 5) {
    jojo = 'És o George Joestar II! - ~~死んだ~~';
  }
  if (last == 6) {
    jojo = 'És o Josuke Higashikata! - "グレートですよこいつは！"';
  }
  if (last == 7) {
    jojo = 'És o Joseph Joestar! - "逃げるんだよ!"';
  }
  if (last == 8) {
    jojo = 'És o Johnathan Joestar! - "サンライトイエローオーバードライブ！"';
  }
  if (last == 9) {
    jojo = 'És o Giorno Giovanna! - "このジョルノジョバーナには夢がある。"';
  }
  message.channel.send(jojo, { files: ["images/jojo (" + last + ").webp"] });
}

module.exports.help = {
  name: 'whichjojo'
}

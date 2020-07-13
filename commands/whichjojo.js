module.exports.run = async (bot, message, command, args, db) => {
  let last = message.member.id.slice(-1);
  let jojo = '';
  let dn = '';
  let agk = '';
  args = args.toLowerCase();

  if (args == 'jojo'){
    if (last == 0) {
      jojo = 'És o George Joestar I!';
    }
    if (last == 1) {
      jojo = 'És a Jolyne Kujo!';
    }
    if (last == 2) {
      jojo = 'És o Jotaro Kujo!';
    }
    if (last == 3) {
      jojo = 'És o Johnny Joestar!';
    }
    if (last == 4) {
      jojo = 'És o Josuke Higashikata!';
    }
    if (last == 5) {
      jojo = 'És o George Joestar II!';
    }
    if (last == 6) {
      jojo = 'És o Josuke Higashikata!';
    }
    if (last == 7) {
      jojo = 'És o Joseph Joestar!';
    }
    if (last == 8) {
      jojo = 'És o Johnathan Joestar!';
    }
    if (last == 9) {
      jojo = 'És o Giorno Giovanna!';
    }
    message.channel.send(jojo, { files: ["images/jojo (" + last + ").webp"] });
  }
  else if (args == 'death note'){
    if (last == 0) {
      dn = 'És a Misa Amane!';
    }
    if (last == 1) {
      dn = 'És o Mello!';
    }
    if (last == 2) {
      dn = 'És o L!';
    }
    if (last == 3) {
      dn = 'És o Touta Matsuda!';
    }
    if (last == 4) {
      dn = 'És o Nate River!';
    }
    if (last == 5) {
      dn = 'És a Rem!';
    }
    if (last == 6) {
      dn = 'És o Teru Mikami!';
    }
    if (last == 7) {
      dn = 'És o Souichiro Yagami!';
    }
    if (last == 8) {
      dn = 'És o Ryuk!';
    }
    if (last == 9) {
      dn = 'És o Light Yagami!';
    }
    message.channel.send(dn, { files: ["images/dn (" + last + ").webp"] });
  }
  else if (args == 'death note') {
    if (last == 0) {
      agk = 'És a Mine!';
    }
    if (last == 1) {
      agk = 'És o Bulat!';
    }
    if (last == 2) {
      agk = 'És o Tatsumi!';
    }
    if (last == 3) {
      agk = 'És a Chelsea!';
    }
    if (last == 4) {
      agk = 'És o Lubbock!';
    }
    if (last == 5) {
      agk = 'És a Akame!';
    }
    if (last == 6) {
      agk = 'És o Susanoo!';
    }
    if (last == 7) {
      agk = 'És a Najenda!';
    }
    if (last == 8) {
      agk = 'És a Leone!';
    }
    if (last == 9) {
      agk = 'És a Sheele!';
    }
    message.channel.send(agk, { files: ["images/agk (" + last + ").webp"] });
  }
}

module.exports.help = {
  name: 'which'
}

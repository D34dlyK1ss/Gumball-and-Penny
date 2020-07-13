module.exports.run = async (bot, message, command, args, db) => {
  let last = message.member.id.slice(-1);
  let jojo = '';
  let dn = '';
  let agk = '';
  
  args = args.toString();

  if (args == ''){
    message.channel.send("Tens de mencionar um anime!");
  }
  else if (args == 'jojo'){
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
  else if (args == 'death,note'){
    if (last == 0) {
      dn = 'És o Ryuk!';
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
      dn = 'És a Misa Amane!';
    }
    if (last == 9) {
      dn = 'És o Light Yagami!';
    }
    message.channel.send(dn, { files: ["images/dn (" + last + ").webp"] });
  }
  else if (args == 'akame,ga,kill') {
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
      agk = 'És a Najenda!';
    }
    if (last == 7) {
      agk = 'És o Susanoo!';
    }
    if (last == 8) {
      agk = 'És a Leone!';
    }
    if (last == 9) {
      agk = 'És a Sheele!';
    }
    message.channel.send(agk, { files: ["images/agk (" + last + ").webp"] });
  }
  else if (args == 'one,punch,man') {
    if (last == 0) {
      opm = 'És a Superalloy Darkshine!';
    }
    if (last == 1) {
      opm = 'És o King!';
    }
    if (last == 2) {
      opm = 'És o Genos!';
    }
    if (last == 3) {
      opm = 'És o Puri-Puri Prisoner!';
    }
    if (last == 4) {
      opm = "És o Speed-o'-Sound Sonic!";
    }
    if (last == 5) {
      opm = 'És o Bang!';
    }
    if (last == 6) {
      opm = 'És a Tatsumaki!';
    }
    if (last == 7) {
      opm = 'És o Garou!';
    }
    if (last == 8) {
      opm = 'És a Fubuki!';
    }
    if (last == 9) {
      opm = 'És o Saitama!';
    }
    message.channel.send(opm, { files: ["images/opm (" + last + ").webp"] });
  }
  else if (args == 'code,geass') {
    if (last == 0) {
      cg = 'És a Euphemia li Britannia!';
    }
    if (last == 1) {
      cg = 'És o Xingke Li!';
    }
    if (last == 2) {
      cg = 'És o Suzaku Kururugi!';
    }
    if (last == 3) {
      cg = 'És o Kaname Ougi!';
    }
    if (last == 4) {
      cg = "És a Cornelia li Britannia!";
    }
    if (last == 5) {
      cg = 'És a Nunnally vi Britannia!';
    }
    if (last == 6) {
      cg = 'És a Shirley Fenette!';
    }
    if (last == 7) {
      cg = 'És a Kallen Stadtfeld!';
    }
    if (last == 8) {
      cg = 'És a C.C.!';
    }
    if (last == 9) {
      cg = 'És o Lelouch vi Britannia!';
    }
    message.channel.send(cg, { files: ["images/cg (" + last + ").webp"] });
  }
}

module.exports.help = {
  name: 'which'
}

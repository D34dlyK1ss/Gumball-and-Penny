module.exports.run = async (bot, message, command, args, db) => {
  let last = message.member.id.slice(-1);
  let char = [];
  args = args.toString();
  args = args.toLowerCase();

  if (args == null || args == '') {
    message.channel.send("Tens de mencionar um anime!");
  }
  else {
    switch (last) {
      case '0':
        char = ["o George Joestar I", "o Teru Mikami", "a Mine", "o Mumen Rider", "a Euphemia li Britannia", "a Yumemi Yumemite", "o Ebisu", "o Deus Ex Machina"];
        break;
      case '1':
        char = ["a Jolyne Kujo", "o Mihael Keehl", "o Bulat", "o King", "o Xingke Li", "o Kaede Manyuda", "o Daikoku", "o Aru Akise"];
        break;
      case '2':
        char = ["o Jotaro Kujo", "o L", "o Tatsumi", "o Genos", "o Suzaku Kururugi", "o Ryouta Suzui", "o Yato", "o Keigo Kurusu"];
        break;
      case '3':
        char = ["o Johnny Joestar", "o Touta Matsuda", "a Chelsea", "o Speed-o'-Sound Sonic", "o Kaname Ougi", "a Mary Saotome", "a Nora", "o Yomotsu Hirasaka"];
        break;
      case '4':
        char = ["o Josuke Higashikata!", "a Rem", "o Lubbock", "o Puri-Puri Prisoner", "a Cornelia li Britannia", "a Ririka Momobami", "o Tenjin", "a Tsubaki Kasugano"];
        break;
      case '5':
        char = ["o George Joestar II!", "a Naomi Misora", "a Akame", "o Bang", "a Nunnally vi Britannia", "a Yumeko Jabami", "o Kazuma", "o Yukiteru Amano"];
        break;
      case '6':
        char = ["o Josuke Higashikata", "o Ryuk", "a Najenda", "a Tatsumaki", "a Shirley Fenette", "a Runa Yomozuki", "o Yukine", "a Yuno Gasai"];
        break;
      case '7':
        char = ["o Joseph Joestar", "o Nate River", "a Esdeath", "o Garou", "a Kallen Stadtfeld", "a Itsuki Sumeragi", "a Kofuku", "a Hinata Hino"];
        break;
      case '8':
        char = ["o Johnathan Joestar", "a Misa Amane", "a Leone", "a Fubuki", "a C.C.", "a Kirari Momobami", "a Hiyori Iki", "a Muru Muru"];
        break;
      case '9':
        char = ["o Giorno Giovanna", "o Light Yagami!", "a Sheele", "o Saitama", "o Lelouch vi Britannia", "a Midari Ikishima", "a Bishamon", "a Minene Uryuu"];
        break;
    }

    switch (args) {
      case "jojo":
        message.channel.send(`És ${char[0]}!`, { files: ["images/which/jojo (" + last + ").jpg"] });
        break;
      case "death,note":
        message.channel.send(`És ${char[1]}!`, { files: ["images/which/dn (" + last + ").jpg"] });
        break;
      case "akame,ga,kill":
        message.channel.send(`És ${char[2]}!`, { files: ["images/which/agk (" + last + ").jpg"] });
        break;
      case "one,punch,man":
        message.channel.send(`És ${char[3]}!`, { files: ["images/which/opm (" + last + ").jpg"] });
        break;
      case "code,geass":
        message.channel.send(`És ${char[4]}!`, { files: ["images/which/cg (" + last + ").jpg"] });
        break;
      case "kakegurui":
        message.channel.send(`És ${char[5]}!`, { files: ["images/which/kakegurui (" + last + ").jpg"] });
        break;
      case "noragami":
        message.channel.send(`És ${char[6]}!`, { files: ["images/which/noragami (" + last + ").jpg"] });
        break;
      case "mirai,nikki":
        message.channel.send(`És ${char[7]}!`, { files: ["images/which/mn (" + last + ").jpg"] });
        break;
    }
  }
}

module.exports.help = {
  name: "which"
}
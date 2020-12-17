function slugify(str) {
	const map = {
		'-' : ' ',
		'a' : 'á|à|ã|â|ä|À|Á|Ã|Â|Ä',
		'e' : 'é|è|ê|ë|É|È|Ê|Ë',
		'i' : 'í|ì|î|ï|Í|Ì|Î|Ï',
		'o' : 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
		'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
		'c' : 'ç|Ç',
		'n' : 'ñ|Ñ',
	};

	for (const pattern in map) {
		str = str.replace(new RegExp(map[pattern], 'g'), pattern);
	}

	return str;
}

module.exports = slugify;
function slugify(str: string) {
	const map = {
		'a' : 'á|à|ã|â|ä|ā|À|Á|Ã|Â|Ä|Ā',
		'e' : 'é|è|ê|ë|ē|É|È|Ê|Ë|Ē',
		'i' : 'í|ì|î|ï|ī|Í|Ì|Î|Ï|Ī',
		'o' : 'ó|ò|ô|õ|ö|ō|Ó|Ò|Ô|Õ|Ö|Ō',
		'u' : 'ú|ù|û|ü|ū|Ú|Ù|Û|Ü|Ū',
		'c' : 'ç|Ç',
		'n' : 'ñ|Ñ'
	};

	for (const pattern in map) {
		str = str.replace(new RegExp((map as any)[pattern], 'g'), pattern);
	}

	return str;
}

export default slugify;
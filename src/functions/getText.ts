function getText(string: string, variables: (string|number)[]) {
	const toInsert = variables.map(String);

	for( let i = 0; i < toInsert.length; i++ ){
		string = string.replace(new RegExp(`\\$${i}\\$`, 'g'), toInsert[i]);
	}

	return string;
}

export default getText;
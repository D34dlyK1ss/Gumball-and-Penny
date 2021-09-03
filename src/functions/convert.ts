function convert(value: number) {
	let valueString = value.toString();

	if (value >= 1000000) {
		valueString = `${value / 1000000}M`;
	}
	else if (value >= 1000) {
		valueString = `${value / 1000}k`;
	}

	return valueString;
}

export default convert;
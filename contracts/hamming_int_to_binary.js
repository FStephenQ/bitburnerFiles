/*
HammingCodes: Integer to Encoded Binary
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


You are given the following decimal value:
123

Convert it to a binary representation and encode it as an 'extended Hamming code'.
The number should be converted to a string of '0' and '1' with no leading zeroes.
Parity bits are inserted at positions 0 and 2^N.
Parity bits are used to make the total number of '1' bits in a given set of data even.
The parity bit at position 0 considers all bits including parity bits.
Each parity bit at position 2^N alternately considers N bits then ignores N bits, starting at position 2^N.
The endianness of the parity bits is reversed compared to the endianness of the data bits:
Data bits are encoded most significant bit first and the parity bits encoded least significant bit first.
The parity bit at position 0 is set last.

Examples:
8 in binary is 1000, and encodes to 11110000 (pppdpddd - where p is a parity bit and d is a data bit)
21 in binary is 10101, and encodes to 1001101011 (pppdpdddpd)

For more information on the 'rule' of encoding, refer to Wikipedia (https://wikipedia.org/wiki/Hamming_code) or the 3Blue1Brown videos on Hamming Codes. (https://youtube.com/watch?v=X8jsijhllIA)


If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.*/

function chunk(arr, size) {
	var chunks = [],
	i = 0,
	n = arr.length;
	while (i < n) {
		chunks.push(arr.slice(i, i += size));
	}
	return chunks;
}

export function hamming_integer_to_binary(ns, input){
    var binary = input.toString(2);
    
	var output = binary;
	var controlBitsIndexes = [];
	var controlBits = [];
	var l = input.length;
	var i = 1;
	var key, j, arr, temp, check;

	while (l / i >= 1) {
		controlBitsIndexes.push(i);
		i *= 2;
	}

	for (j = 0; j < controlBitsIndexes.length; j++) {
		key = controlBitsIndexes[j];
		arr = output.slice(key - 1).split('');
		temp = chunk(arr, key);
		check = (temp.reduce(function (prev, next, index) {
			if (!(index % 2)) {
				prev = prev.concat(next);
			}
			return prev;
		}, []).reduce(function (prev, next) { return +prev + +next }, 0) % 2) ? 1 : 0;
		output = output.slice(0, key - 1) + check + output.slice(key - 1);
		if (j + 1 === controlBitsIndexes.length && output.length / (key * 2) >= 1) {
			controlBitsIndexes.push(key * 2);
		}
	}
    ns.print(output);
	return output;
}
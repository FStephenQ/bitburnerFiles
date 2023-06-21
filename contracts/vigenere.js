/*
Vigenère cipher is a type of polyalphabetic substitution. It uses the Vigenère square to encrypt and decrypt plaintext with a keyword.

  Vigenère square:
         A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
       +----------------------------------------------------
     A | A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
     B | B C D E F G H I J K L M N O P Q R S T U V W X Y Z A
     C | C D E F G H I J K L M N O P Q R S T U V W X Y Z A B
     D | D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
     E | E F G H I J K L M N O P Q R S T U V W X Y Z A B C D
                ...
     Y | Y Z A B C D E F G H I J K L M N O P Q R S T U V W X
     Z | Z A B C D E F G H I J K L M N O P Q R S T U V W X Y

For encryption each letter of the plaintext is paired with the corresponding letter of a repeating keyword. For example, 
the plaintext DASHBOARD is encrypted with the keyword LINUX:
   Plaintext: DASHBOARD
   Keyword:   LINUXLINU
So, the first letter D is paired with the first letter of the key L. Therefore, row D and column L of the Vigenère square are used 
to get the first cipher letter O. This must be repeated for the whole ciphertext.

You are given an array with two elements:
  ["FRAMEARRAYCACHEPRINTFLASH", "PASSWORD"]
The first element is the plaintext, the second element is the keyword.

Return the ciphertext as uppercase string.
*/

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SQUARE = function() {
    var sqr = [];
    for(var i of ALPHABET){
        var start = ALPHABET.indexOf(i);
        var back = ALPHABET.slice(0, start);
        var front = ALPHABET.slice(start);
        sqr.push(front+back);
    }
    return sqr;
}();


export function vingenere(ns, input){
    ns.print(input);
    var plaintext = input[0];
    var key = input[1];
    if(plaintext.length > key.length){
        var times = Math.floor(plaintext.length/key.length);
        var leftover_length = Math.ceil(plaintext.length % key.length);
        key = key.repeat(times) + key.slice(0, leftover_length);
    }
    ns.print(key);
    var ciphertext = '';
    for(var i = 0; i < plaintext.length; i++){
        ciphertext += SQUARE[ALPHABET.indexOf(plaintext[i])][ALPHABET.indexOf(key[i])];
    }
    ns.print(ciphertext);
    return ciphertext;
}
/** @param {NS} ns */

export async function main(ns) {
  var plaintext = "VIRUS SHIFT LOGIN MACRO QUEUE".split('');
  var key = 24;
  var ciphertext = ceasar_cipher(ns, [plaintext, key])
  ns.print("CText: "+ciphertext);
  ns.tail();
}

export function ceasar_cipher(ns, input){
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  var plaintext = input[0];
  var key = input[1];
  var ciphertext = '';
  for(var p of plaintext){
    ns.print(p);
    if(p == ' ') ciphertext = ciphertext + ' ';
    else {
      var shift = alphabet.indexOf(p)-key;
      if (shift < 0){
        shift = 26+shift;
      }
      ciphertext = ciphertext + alphabet[Math.floor((shift % alphabet.length))];
    }
  }
  return ciphertext;
}
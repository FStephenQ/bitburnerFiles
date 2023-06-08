/** @param {NS} ns */

export async function main(ns) {
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  var plaintext = "VIRUS SHIFT LOGIN MACRO QUEUE".split('');
  var key = 24;
  var ciphertext = '';
  for(var p of plaintext){
    ns.print(p);
    if(p == ' ') ciphertext = ciphertext + ' ';
    else {
      var shift = alphabet.indexOf(p)-key;
      if (shift < 0){
        shift = 26+shift;
      }
      ciphertext = ciphertext + alphabet[(shift % alphabet.length)];
    }
  }
  ns.print("CText: "+ciphertext);
  ns.tail();
}
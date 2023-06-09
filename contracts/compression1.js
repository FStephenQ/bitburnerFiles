/** @param {NS} ns */
/*
Run-length encoding (RLE) is a data compression technique which encodes data as a series 
of runs of a repeated single character. Runs are encoded as a length, 
followed by the character itself. Lengths are encoded as a single ASCII digit; 
runs of 10 characters or more are encoded by splitting them into multiple runs.

You are given the following input string:
    ZZECG88vvvvvvVvvKK5566LLLLLLrrQQ88888888888rrDD55ssssssKJJJPPTT6666
Encode it using run-length encoding with the minimum possible output length.

Examples:
    aaaaabccc            ->  5a1b3c
    aAaAaA               ->  1a1A1a1A1a1A
    111112333            ->  511233
    zzzzzzzzzzzzzzzzzzz  ->  9z9z1z  (or 9z8z2z, etc.)
    */
export async function main(ns) {
  var input = 'ggg33FFyyGGGGGGGGGKeFPPzzhLLLLLLLLLOOhVV8888FzkMMkpbbppppppp';
  var output = compression_one(ns, input);
  ns.tail();
  ns.print(output);
}

export function compression_one(ns, input){
  var output = '';
  var start = 0;
  for(var i =0; i<input.length;i++){
    if(input[i+1] != input[i]){
      var length = (i-start)+1;
      if(length > 10){
        var nines = Math.floor(length / 9);
        for(var p = 0; p < nines; p++){
          output += 9+''+input[i];
          if(p > 20){
            ns.print("Something has gone horribly wrong: "+nines);
          }
        }
        var extra = Math.ceil(length % 9);
        output += extra+''+input[i];
      }else{
        output += length+''+input[i];
      }
      start = i+1;
    }
  }
  return output;
}
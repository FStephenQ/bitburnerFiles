/// <reference path="../NetscriptDefinitions.d.ts" />
/** @param {NS} ns */

/*

Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data, which is either:

1. Exactly L characters, which are to be copied directly into the uncompressed data.
2. A reference to an earlier part of the uncompressed data. To do this, 
the length is followed by a second ASCII digit X: each of the L output characters 
is a copy of the character X places before it in the uncompressed data.

For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the start of a new chunk. The two chunk types alternate, 
starting with type 1, and the final chunk may be of either type.

You are given the following LZ-encoded string:
    9mmaQcU01L08BPByCqPG336UzBede197BRzYhW88409858YmKP784vwic447QicvqxS
Decode it and output the original string.
Example: decoding '5aaabb450723abb' chunk-by-chunk
    5aaabb           ->  aaabb
    5aaabb45         ->  aaabbaaab
    5aaabb450        ->  aaabbaaab
    5aaabb45072      ->  aaabbaaababababa
    5aaabb450723abb  ->  aaabbaaababababaabb
*/

export async function main(ns) {
    compression_two(ns, "95IaY17M5O730378B8aT1eOQ534gkUe764iy7P5196R1NLs6Mf0347h")
}

export function compression_two(ns, compressed){
    ns.tail();
    let output = "";
    let chunk_type = 1;
    for (var i = 0; i < compressed.length; i++) {
      if (compressed[i] == "0") {
        chunk_type = chunk_type == 2 ? 1 : 2;
        continue;
      }
      let chunk = "";
      if (chunk_type == 2) {
        chunk = compressed.slice(i, i + 2);
        i++;
        output = process_chunk(ns, output, chunk, chunk_type);
        chunk_type = 1;
      } else {
        chunk = compressed.slice(i + 1, i + parseInt(compressed[i]) + 1);
        i += parseInt(compressed[i]);
        output = process_chunk(ns, output, chunk, chunk_type);
        chunk_type = 2;
      }
      ns.print("Chunk: " + chunk);
      ns.print("Output: " + output);
    }
    ns.print(output);
}

function process_chunk(ns, previous_string, chunk, chunk_type) {
  let ret = previous_string;
  ns.print(chunk);
  if (chunk_type == 2) {
    ns.print(chunk);
    let length = parseInt(chunk[0]);
    let unit = parseInt(chunk[1]);
    ns.print("Length: " + length);
    ns.print("Unit: " + unit);
    for (var j = 0; j < length; j++) {
      ret += ret[ret.length - unit];
    }
  } else {
    ret = ret + chunk;
  }
  ns.print("Ret: " + ret);
  return ret;
}

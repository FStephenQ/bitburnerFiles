/** @param {NS} ns */
/*Given the following string containing only digits, return an array with all 
possible valid IP address combinations that can be created from the string:

145.6.101.145

Note that an octet cannot begin with a '0' unless 
the number itself is actually 0. For example, 
'192.168.010.1' is not a valid IP.

Examples:

25525511135 -> ["255.255.11.135", "255.255.111.35"]
1938718066 -> ["193.87.180.66"]*/
export async function main(ns) {
  find_valid_ip(ns, "239178249249");
}

export function find_valid_ip(ns, input){
  ns.tail();
  ns.print(input.length);
  var ret = [];
  for(var i = 1; i < 4; i++){
    for(var p = i; p <i+4; p++){
      for(var q = p; q < p+4; q++){
        for(var d = q; d < input.length; d++){
          var candidate = [
            input.slice(0, i),
            input.slice(i,p),
            input.slice(p, q),
            input.slice(d,)
          ];
          if(candidate.join('').length == input.length && is_valid_ip(ns, candidate)){
            ret.push(candidate.join('.'));
          }
        }
      }
    }
  }
  ns.print(ret);
  return ret;
}

function is_valid_ip(ns, candidate){
  for(var segment of candidate){
    try{
      if(segment[0] == '0'){
        return false;
      }
      if(segment.length < 1){
        return false;
      }
      if(parseInt(segment) > 255){
        return false;
      }
    }
    catch {
      ns.print("Exception on: "+segment);
      return false;
    }
  }
  return true;
}
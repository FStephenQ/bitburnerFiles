/** @param {NS} ns */
export async function main(ns) {
  const input = [-3,0,-1,-9,-4,6,-4,4,-7,-3,7,-3,2,-3,10,-4,5,6,0,-5];
  let highest_sum = 0;
  let highest_subset = [];

  for(var i = 0; i < input.length-1; i++){
    for(var p = i+1; p < input.length; p++){
      var tmp = input.slice(i, p);
      var sum = tmp.reduce((a,b)=>{return a+b;});
      if(sum > highest_sum){
        highest_sum = sum;
        highest_subset = tmp;
      }
    }
  }
  ns.tail()
  ns.print("Sum: "+highest_sum);
  ns.print("Subset: "+highest_subset);
}
/** @param {NS} ns */
/*
You are given the following array of stock prices (which are numbers) where the i-th element 
represents the stock price on day i:

37,73,60,42,153,148,84,71,12,43,62,71,116,39,134,146,186,12,6,160,66,161,71,7,139,49,108,119,53,37,115,187,10,184,62,177,17,35,14,159,198,119,97,81,130,79,17,32,46

Determine the maximum possible profit you can earn using at most one transaction (i.e. you can 
only buy and sell the stock once). If no profit can 
be made then the answer should be 0. Note that you have to buy the stock before you can sell it
*/
export async function main(ns) {
  var input = [184,60,36,65,93,54,159,191,20,149,73,142,88,182,111,134,87,150,13,75,162,145];
  var max_profit = stocks_1(ns, input);
  ns.tail();
  ns.print(max_profit);
}

export function stocks_1(ns, input){
  var max_profit = 0;
  for(var i = 0; i < input.length; i++){
    for(var p = i; p < input.length; p++){
      if(max_profit < (input[p]-input[i])) max_profit = input[p]-input[i];
    }
  }
  return max_profit;
}
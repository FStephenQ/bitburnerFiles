/** @param {NS} ns */
export async function main(ns) {
  var arr = [134,159,63,154,66,44,4,79,109,91,29,13,19,146,39,119,134,24,190,105];
  var last = 1;
  var previous_price = 91;
  
  ns.tail()
  ns.print(profit);
}

export function stocks_2(ns, arr){
  var profit = 0;
  for (let p = 1; p < arr.length; ++p) {
				profit += Math.max(arr[p] - arr[p - 1], 0)
	}
  return profit;
}

  /*for (var i = 2; i < arr.length; i++) {
    if (arr[last] > arr[i] && stock_held) {
      ns.print("ar last: " + arr[last]);
      ns.print("arr i: " + arr[i]);
      ns.print("pp: " + previous_price);
      ns.print("diff: " + (arr[last] - previous_price));
      ns.print("ffffffffffffffffffff")
      var diff = arr[last] - previous_price;
      if (diff > 0) {
        profit = profit + diff;
        stock_held = false;
      }
    }
    if(arr[last] < arr[i] && !stock_held){
      previous_price = arr[last];
      profit = profit - arr[last];
      stock_held = true;
    }
    last = i;
  }*/
  /*var banned = []
var max_profit = 0;
while (banned.length < arr.length) {
  var profits = await get_max_profit(ns, banned);
  var sorted_profit = Object.entries(profits).sort(function (a, b) {
    return a[1].profit - b[1].profit;
  });
  if(sorted_profit.length == 0) break;
  var most_profitable = sorted_profit.pop()[1]
  banned.push(most_profitable.bought_at+"");
  banned.push(most_profitable.sold_at+"");
  max_profit = max_profit + most_profitable.profit;
  ns.print(most_profitable);
  ns.print(banned);
}
ns.print('prof');
ns.print(max_profit);
}

async function get_max_profit(ns, banned) {
var arr = [164, 91, 121, 157, 57, 180, 86, 100, 150, 159, 38, 157, 40, 41, 157, 93, 36, 20, 95, 113, 172, 193, 144, 33, 170, 176];
var differences = {};
for (var i = 0; i < arr.length; i++) {
  if (banned.includes(""+i));
  else {
    var p = i;
    for (; p < arr.length; p++) {
      if (banned.includes(""+p));
      else {
        var diff = arr[p] - arr[i];
        if (diff > 0) {
          if (differences[i] != undefined) {
            if (differences[i].profit < diff) {
              differences[i] = {
                bought_at: i,
                buy_price: arr[i],
                sold_at: p,
                sell_price: arr[p],
                profit: diff
              }
            }
          }
          else {
            differences[i] = {
              bought_at: i,
              buy_price: arr[i],
              sold_at: p,
              sell_price: arr[p],
              profit: diff
            }
          }
        }
      }
    }
  }
}
return differences;
}*/
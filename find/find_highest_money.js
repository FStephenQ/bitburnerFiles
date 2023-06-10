/// <reference path="../NetscriptDefinitions.d.ts"/>

/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  var result = await get_money(ns, 'home', 'home');
  ns.print(result);
}

/** @param {NS} ns */
async function get_money(ns, host, origin) {
  var local_money = host == origin ? 0: ns.getServerMoneyAvailable(host);
  var local_richest = host == origin ? '': host;
  var local = ns.scan(host);
  for (var h of local) {
    if (h == origin) continue;
    var result = await get_money(ns, h, host);
    var cash = result.local_highest_money;
    var richest = result.local_highest_name;
    if (cash > local_money && ns.hasRootAccess(h)) {
      local_money = cash;
      local_richest = richest;
    }
  }
  return {
    local_highest_money: local_money,
    local_highest_name: local_richest
  }
}
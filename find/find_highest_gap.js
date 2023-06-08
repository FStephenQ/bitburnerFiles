/// <reference path="../NetscriptDefinitions.d.ts"/>

/** @param {NS} ns */
function contains(array, string){
  return array.indexOf(string) > -1;
}
const BLACKLIST = ["omega-net"]
export async function main(ns) {
  ns.tail();
  var result = await get_money(ns, 'home', 'home');
  ns.print(result);
}

async function get_money(ns, host, origin) {
  var local_money = (host == origin || contains(BLACKLIST, host)) ? 0: (100/ns.getServerGrowth(host))*ns.getServerMaxMoney(host);
  var local_richest = (host == origin || contains(BLACKLIST, host)) ? '': host;
  ns.print(host);
  ns.print(local_richest);
  var local = ns.scan(host);
  for (var h of local) {
    if (h == origin || contains(BLACKLIST, h)) continue;
    var result = await get_money(ns, h, host);
    var cash = result.local_highest_money;
    var richest = result.local_highest_name;
    if (cash > local_money && ns.getServerRequiredHackingLevel(h) <= ns.getHackingLevel()) {
      local_money = cash;
      local_richest = richest;
    }
  }
  return {
    local_highest_money: local_money,
    local_highest_name: local_richest
  }
}
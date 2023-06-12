/// <reference path="../NetscriptDefinitions.d.ts"/>

/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  var result = await get_money(ns, 'home', 'home');
  ns.clearLog();
  ns.print(`Highest growth value server is ${result.highest_growth_name}, with a value of ${ns.formatNumber(result.highest_growth_value)}`);
  ns.print(`This server currently has $${ns.formatNumber(ns.getServerMoneyAvailable(result.highest_growth_name))} available, and a security value of ${ns.formatNumber(ns.getServerSecurityLevel(result.highest_growth_name))}`);
  ns.print(`Weaken time: ${ns.tFormat(ns.getWeakenTime(result.highest_growth_name))}`);
  ns.print(`Grow time: ${ns.tFormat(ns.getGrowTime(result.highest_growth_name))}`);
  ns.print(`Hack time: ${ns.tFormat(ns.getHackTime(result.highest_growth_name))}`);
}

async function get_money(ns, host, origin) {
  var local_growth = (host == origin) ? 0: (100/ns.getServerGrowth(host))*ns.getServerMaxMoney(host);
  var local_highest_growth = (host == origin) ? '': host;
  var local = ns.scan(host);
  for (var h of local) {
    if (h == origin) continue;
    var result = await get_money(ns, h, host);
    var cash = result.highest_growth_value;
    var richest = result.highest_growth_name;
    if (cash > local_growth && ns.hasRootAccess(h)) {
      local_growth = cash;
      local_highest_growth = richest;
    }
  }
  return {
    highest_growth_value: local_growth,
    highest_growth_name: local_highest_growth
  }
}
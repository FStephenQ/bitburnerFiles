/// <reference path="../NetscriptDefinitions.d.ts"/>

/** @param {NS} ns */

export async function main(ns) {
  ns.disableLog('scan');
  ns.disableLog('getHackingLevel');
  ns.disableLog('getServerRequiredHackingLevel');
  ns.disableLog('hasRootAccess');
  ns.disableLog('getServerNumPortsRequired')
  ns.clearLog();
  ns.tail();
  var result = await descend(ns, 'home', 'home');
  ns.print(result);

}

async function descend(ns, host, origin) {
  var local = ns.scan(host);
  var result = {
    'host': host,
    'cost': ns.getHackTime(host)
  };
  for (var q of ['home', 'beefy-boi', 'darkweb']) {
    if (host == q) {
      result.cost = 100000000000;
    }
  }
  for (var h of local) {
    if (h == origin) continue;
    var tmp = await descend(ns, h, host);
    //ns.print(tmp);
    if (ns.hasRootAccess(h) && ns.getServerRequiredHackingLevel(h) <= ns.getHackingLevel()
      && ns.getServerNumPortsRequired(h) < 5) {
      if (result.cost > tmp.cost) {
        result = tmp;
      }
    }
  }
  return result;
}
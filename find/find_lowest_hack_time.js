/// <reference path="../NetscriptDefinitions.d.ts"/>

/** @param {NS} ns */

export async function main(ns) {
  ns.disableLog('scan');
  ns.disableLog('getHackingLevel');
  ns.disableLog('getServerRequiredHackingLevel');
  ns.disableLog('hasRootAccess');
  ns.disableLog('getServerNumPortsRequired')
  ns.clearLog();
  ns.ui.openTail();
  var result = await descend(ns, 'home', 'home');
  ns.print(result);

}

async function descend(ns, host, origin) {
  var local = ns.scan(host);
  var hackTime = 100000000000;
  try { hackTime = ns.getHackTime(host); } catch { /* non-hackable server */ }
  var result = {
    'host': host,
    'cost': hackTime
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
    var reqLevel = Infinity, numPorts = 5;
    try { reqLevel = ns.getServerRequiredHackingLevel(h); numPorts = ns.getServerNumPortsRequired(h); } catch { /* non-hackable */ }
    if (ns.hasRootAccess(h) && reqLevel <= ns.getHackingLevel()
      && numPorts < 5) {
      if (result.cost > tmp.cost) {
        result = tmp;
      }
    }
  }
  return result;
}
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
  await descend(ns, 'home', 'home');
}

async function descend(ns, host, origin) {
  var local = ns.scan(host);
  for (var h of local) {
    if (h == origin) continue;
    await descend(ns, h, host);
    try {
      if (!ns.hasRootAccess(h) && ns.getServerRequiredHackingLevel(h) <= ns.getHackingLevel()
          && ns.getServerNumPortsRequired(h) < 5) {
        ns.print("Unhacked server: "+h);
        ns.print("Ports needed: "+ns.getServerNumPortsRequired(h))
      }
    } catch { /* non-hackable server, skip */ }
  }
}
/// <reference path="NetscriptDefinitions.d.ts"/>


/** @param {NS} ns */
export async function main(ns) {
  const HACK_FUNCTION_MAP = {
    'BruteSSH.exe': ns.brutessh,
    'FTPCrack.exe': ns.ftpcrack,
    'relaySMTP.exe': ns.relaysmtp,
    'HTTPWorm.exe': ns.httpworm,
    'SQLInject.exe': ns.sqlinject
  };
  var available_scripts = ns.ls("home", "exe").filter((a) => Object.keys(HACK_FUNCTION_MAP).includes(a));
  var hack_level = available_scripts.length;
  var servers = ns.cloud.getServerNames();
  var descend = function (ns, host, origin) {
    var local = ns.scan(host);
    for (var h of local) {
      if (h == origin || servers.includes(h)) {
        continue;
      }
      if (ns.hasRootAccess(h) == false) {
        try {
          if (ns.getServerNumPortsRequired(h) <= hack_level && ns.getServerRequiredHackingLevel(h) <= ns.getHackingLevel()) {
            available_scripts.forEach((a) => { HACK_FUNCTION_MAP[a](h); })
            ns.nuke(h);
          }
        } catch { /* non-hackable server, skip */ }
      }
      descend(ns, h, host);
    }
  }
  descend(ns, 'home', 'home');
}

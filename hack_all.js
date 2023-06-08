/// <reference path="NetscriptDefinitions.d.ts"/>

import {contains} from 'common.js';

/** @param {NS} ns */
export async function main(ns) {
  const HACK_FUNCTION_MAP = {
    'BruteSSH.exe': ns.brutessh,
    'FTPCrack.exe': ns.ftpcrack,
    'relaySMTP.exe': ns.relaysmtp,
    'HTTPWorm.exe': ns.httpworm,
    'SQLInject.exe': ns.sqlinject
  };
  var available_scripts = ns.ls("home", "exe").filter((a) => { return contains(Object.keys(HACK_FUNCTION_MAP), a); });
  var hack_level = available_scripts.length;
  var servers = ns.getPurchasedServers();
  var descend = function (ns, host, origin) {
    var local = ns.scan(host);
    for (var h of local) {
      if (h == origin || contains(servers, h)) {
        continue;
      }
      if (ns.hasRootAccess(h) == false) {
        if (ns.getServerNumPortsRequired(h) <= hack_level && ns.getServerRequiredHackingLevel(h) < ns.getHackingLevel()) {
          available_scripts.forEach((a) => { HACK_FUNCTION_MAP[a](h); })
          ns.nuke(h);
        }
      }
      descend(ns, h, host);
    }
  }
  descend(ns, 'home', 'home');
}

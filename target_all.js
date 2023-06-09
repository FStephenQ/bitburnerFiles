/// <reference path="NetscriptDefinitions.d.ts"/>

import { contains } from "./common";

/** @param {NS} ns */
export async function main(ns) {
  const HACK_FUNCTION_MAP = {
    'BruteSSH.exe': ns.brutessh,
    'FTPCrack.exe': ns.ftpcrack,
    'relaySMTP.exe': ns.relaysmtp,
    'HTTPWorm.exe': ns.httpworm,
    'SQLInject.exe': ns.sqlinject
  };

  var available_scripts = ns.ls("home", "exe").filter((a) => {return contains(Object.keys(HACK_FUNCTION_MAP), a);});
  var hack_level = available_scripts.length;
  var local = ns.scan();
  ns.print(local);
  for(var host of local){
    if(host == ns.args[0] || contains(ns.getPurchasedServers(), host) || ns.getServerRequiredHackingLevel(host) > ns.getHackingLevel()){
      continue;
    }
    ns.scp(['get_started.js', 'generic.js', 'target_all.js'], host);
    if(ns.hasRootAccess(host) == false){
      available_scripts.forEach((a) => {HACK_FUNCTION_MAP[a](host);})
      if(ns.getServerNumPortsRequired(host) <= hack_level){
        ns.nuke(host);
      }
    }
    else{
      ns.killall(host);
    }
    ns.exec('target_all.js', host, 1, ns.getHostname(), ns.args[1]);
    ns.print("Started run on "+host);
  }
  if(ns.getHostname() != 'home'){
    ns.run('get_started.js', 1, ns.args[1]);
  }
}
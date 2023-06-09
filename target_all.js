/// <reference path="NetscriptDefinitions.d.ts"/>

import { contains, get_hacked } from "/common";

/** @param {NS} ns */
export async function main(ns) {
  ns.run("hack_all.js");
  await ns.sleep(1000);
  /** @type {Server[]} hacked */
  var hacked = await get_hacked(ns, "home", "home");
  var total_ram_deployed = 0;
  for(var host of hacked){
    if(host.hostname == "home" || contains(ns.getPurchasedServers(), host.hostname) || !host.hasAdminRights){
      continue;
    }
    if(host.maxRam >= ns.getScriptRam('generic.js', 'home')){
      if(host.ramUsed > 0){
        ns.killall(host.hostname);
      }
      ns.scp(['get_started.js', 'generic.js'], host.hostname);
      ns.exec('get_started.js', host.hostname, 1, ns.args[0]);
      total_ram_deployed += host.maxRam;
    }
  }
  ns.tprint(`Unleashed ${ns.formatRam(total_ram_deployed)} (${ns.formatNumber(total_ram_deployed/ns.getScriptRam('generic.js'))} threads) of RAM on ${ns.args[0]}`);
}
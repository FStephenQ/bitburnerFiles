/// <reference path="NetscriptDefinitions.d.ts"/>

import { contains, get_hacked } from "/common";

/** @param {NS} ns */
export async function main(ns) {
  ns.run("hack_all.js");
  await ns.sleep(1000);
  /** @type {Server[]} hacked */
  var hacked = await get_hacked(ns, "home", "home");
  var target = ns.getServer(ns.args[0]);
  ns.tprint(target);
  var threads_necessary = find_threads_necessary(ns, target);
  ns.tprint(threads_necessary);
  var hack_threads_left = threads_necessary.hackThreads - assign_task_to_servers(ns, hacked, threads_necessary.hackThreads, 'just_hack.js', target);
  if(hack_threads_left > 0){
    ns.tprint(`Only enough RAM to partially hack; ${hack_threads_left} out of ${threads_necessary.hackThreads} threads left`);
  }
  var grow_threads_left = threads_necessary.growThreads - assign_task_to_servers(ns, hacked, threads_necessary.growThreads, 'just_growth.js', target);
  if(grow_threads_left > 0){
    ns.tprint(`Only enough RAM to partially grow; ${grow_threads_left} out of ${threads_necessary.growThreads} threads left`);
  }
  var weaken_pool = hacked.concat(ns.getPurchasedServers().filter((a) => {return a.indexOf('weaken') >= 0;}).map(ns.getServer));
  var weaken_threads_left = threads_necessary.weakenThreads - assign_task_to_servers(ns, weaken_pool, threads_necessary.weakenThreads, 'just_weaken.js', target);
  if(weaken_threads_left > 0){
    ns.tprint(`Only enough RAM to partially weaken; ${weaken_threads_left} out of ${threads_necessary.weakenThreads} threads left`);
  }
  ns.tprint("Finished distributing to servers");
}

/** @param {NS} ns, @param {Server} target */
function find_threads_necessary(ns, target){
  var tmp_server = target;
  tmp_server.moneyAvailable = target.moneyMax;
  tmp_server.hackDifficulty = 100;
  var hack_threads_to_hundred = 1/(ns.formulas.hacking.hackPercent(tmp_server, ns.getPlayer()));
  tmp_server.moneyAvailable = 0;
  var grow_threads_to_max = ns.formulas.hacking.growThreads(tmp_server, ns.getPlayer(), tmp_server.moneyMax);
  return {
    'hackThreads': hack_threads_to_hundred,
    'growThreads': grow_threads_to_max,
    'weakenThreads': 2000
  }
}

function assign_task_to_servers(ns, servers, num_threads, script_name, target){
  for(var server of servers){
    num_threads -= assign_task(ns, server, script_name, target);
    if(num_threads <= 0){
      break;
    }
  }
  return num_threads;
}

/** @param {NS} ns, @param {Server} server */
function assign_task(ns, server, script_name, target){
  var threads = (ns.getServerMaxRam(server.hostname) - ns.getServerUsedRam()) / ns.getScriptRam(script_name);
  if(threads > 0 && ns.exec(script_name, server.hostname, threads, target) != 0) return threads;
  return 0;
}
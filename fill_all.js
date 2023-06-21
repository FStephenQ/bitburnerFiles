/** @param {NS} ns */
export async function main(ns) {
  const HOST = ns.getHostname();
  const max_ram = ns.getServerMaxRam(HOST)-ns.getServerUsedRam(HOST);
  const weaken_ram = ns.getScriptRam(ns.args[0]);
  
  var num_threads = Math.floor(max_ram/weaken_ram);
  if(num_threads > 0) ns.spawn(ns.args[0], parseInt(num_threads), ns.args[1]);
  else{
    ns.print(`Unable to start ${ns.args[1]} on ${ns.args[0]} due to insufficient ram`)
  }
}
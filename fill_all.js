/** @param {NS} ns */
export async function main(ns) {
  const HOST = ns.getHostname();
  const max_ram = ns.getServerMaxRam(HOST)-ns.getServerUsedRam(HOST);
  const weaken_ram = ns.getScriptRam(ns.args[0]);
  
  var num_threads = max_ram/weaken_ram;

  ns.spawn(ns.args[0], parseInt(num_threads), ns.args[1]);
}
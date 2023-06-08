/** @param {NS} ns */
export async function main(ns) {
  const HOST = ns.getHostname();
  const max_ram = ns.getServerMaxRam(HOST);
  const weaken_ram = ns.getScriptRam('generic.js');
  
  var num_threads = max_ram/weaken_ram;

  ns.spawn('generic.js', parseInt(num_threads), ns.args[0] ?? HOST);
}
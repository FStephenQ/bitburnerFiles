/** @param {NS} ns */

export async function main(ns) {
  const HOST = ns.args[0] ?? ns.getHostname();
  await reduce_security_level(ns, HOST);
  while (true) {
    await grow_money(ns, HOST);
    await reduce_security_level(ns, HOST);
    while(await ns.hack(HOST) == 0);
    await reduce_security_level(ns, HOST);
  }
}

async function reduce_security_level(ns, HOST){
  var cur_sec_level = ns.getServerSecurityLevel(HOST);
  const min_sec_level = ns.getServerMinSecurityLevel(HOST)*1.25;
  while (cur_sec_level > min_sec_level) {
    await ns.weaken(HOST);
    cur_sec_level = ns.getServerSecurityLevel(HOST);
  }
  return;
}

async function grow_money(ns, HOST){
  const max_money = ns.getServerMaxMoney(HOST);
  var cur_money = ns.getServerMoneyAvailable(HOST);
  while(cur_money < max_money){
    var percent = await ns.grow(HOST);
    ns.print("Percent growth: "+percent)
    if(percent < 1.01) break;
    cur_money = ns.getServerMoneyAvailable(HOST);
  }
  return;
}
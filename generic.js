/** @param {NS} ns */

export async function main(ns) {
  const HOST = ns.args[0] ?? ns.getHostname();
  await reduce_security_level(ns, HOST);
  while (true) {
    await grow_money(ns, HOST);
    await reduce_security_level(ns, HOST);
    await hack_away(ns, HOST);
    await reduce_security_level(ns, HOST);
  }
}

/** @param {NS} ns */
async function hack_away(ns, HOST){
  var money_available = ns.getServerMoneyAvailable(HOST);
  while(money_available > 0){
    while(await ns.hack(HOST) == 0){
      if(ns.getServerSecurityLevel(HOST) >= 100){
        return;
      }
    };
    money_available = ns.getServerMoneyAvailable(HOST);
  }
}

/** @param {NS} ns */
async function reduce_security_level(ns, HOST){
  const min_sec_level = ns.getServerMinSecurityLevel(HOST) * 1.25;
  var cur_sec_level = ns.getServerSecurityLevel(HOST);
  if(cur_sec_level <= min_sec_level) return;
  while (cur_sec_level > min_sec_level) {
    await ns.weaken(HOST);
    cur_sec_level = ns.getServerSecurityLevel(HOST);
  }
}

/** @param {NS} ns */
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

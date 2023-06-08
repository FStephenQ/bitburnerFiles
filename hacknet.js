/** @param {NS} ns */
const NODE_MONEY_RATIO = .1;
const NODE_LEVEL_RATIO = .001;
const NODE_RAM_RATIO = .01;
const NODE_CORE_RATIO = .01

export async function main(ns) {
  var current_node = 0;
  while (true) {
    current_node = await max_out_nodes(ns);
    ns.print(current_node);
    for (var i = 0; i <= current_node; i++) await max_out_node(ns, i);
    await ns.sleep(20000);
  }
}

async function max_out(ns, cost_function, purchase_function, ratio, node) {
  var current_node = 0;
  let diff = await cost_function(node, 1) / await ns.getServerMoneyAvailable("home");
  while (diff < ratio) {
    current_node = await purchase_function(node, 1);
    diff = await cost_function(node, 1) / await ns.getServerMoneyAvailable("home");
  }
  return current_node;
}

async function max_out_nodes(ns) {
  var current_node = ns.hacknet.numNodes()-1;
  let diff = await ns.hacknet.getPurchaseNodeCost() / await ns.getServerMoneyAvailable("home");
  while (diff < NODE_MONEY_RATIO) {
    current_node = await ns.hacknet.purchaseNode();
    diff = await ns.hacknet.getPurchaseNodeCost / await ns.getServerMoneyAvailable("home");
  }
  return current_node;
}

async function max_out_node(ns, index) {
  await max_out(ns, ns.hacknet.getLevelUpgradeCost, ns.hacknet.upgradeLevel, NODE_LEVEL_RATIO, index);
  await max_out(ns, ns.hacknet.getRamUpgradeCost, ns.hacknet.upgradeRam, NODE_RAM_RATIO, index);
  await max_out(ns, ns.hacknet.getCoreUpgradeCost, ns.hacknet.upgradeCore, NODE_CORE_RATIO, index);
}
/// <reference path="../NetscriptDefinitions.d.ts"/>


/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("scan");
  ns.clearLog();
  var contracts =  await find_contracts(ns, 'home', 'home','');
  ns.print("Contracts found: \n"+ contracts.join('\n'));
  ns.tail();
}

async function find_contracts(ns, host, origin, route) {
  var contracts = [];
  route = route+'=>'+host
  var local_files = await ns.ls(host, '.cct'); 
  if (local_files.length > 0) {
    for(var file of local_files){
      var type = ns.codingcontract.getContractType(file, host);
      contracts.push("Host: "+route+", Contract: "+file+", Type: "+type);
    }
  }
  var local = await ns.scan(host);
  for (var h of local) {
    if (h == origin) continue;
    contracts = contracts.concat(await find_contracts(ns, h, host, route));
  }
  return contracts;
}
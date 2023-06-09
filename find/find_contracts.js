/// <reference path="../NetscriptDefinitions.d.ts"/>


/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("scan");
  ns.clearLog();
  var contracts =  await find_contracts(ns, 'home', 'home','');
  ns.print("Contracts found: \n"+ contracts.map((a) => {return a.str;}).join('\n'));
  ns.tail();
}

/** @param {NS} ns */
export async function find_contracts(ns, host, origin, route) {
  var contracts = [];
  route = route+'=>'+host
  var local_files = ns.ls(host, '.cct'); 
  if (local_files.length > 0) {
    for(var file of local_files){
      var type = await ns.codingcontract.getContractType(file, host);
      var contract = {
        'str': "Host: "+route+", Contract: "+file+", Type: "+type,
        'filename': file,
        'hostname': host,
        'type': type
      }
      contracts.push(contract);
    }
  }
  var local = await ns.scan(host);
  for (var h of local) {
    if (h == origin) continue;
    contracts = contracts.concat(await find_contracts(ns, h, host, route));
  }
  return contracts;
}
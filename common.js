export async function get_hacked(ns, host, origin) {
  var hacked = [];
  var local = await ns.scan(host);
  for (var h of local) {
    if (h == origin ||contains(ns.getPurchasedServers(), h)) {
      continue;
    }
    if (ns.hasRootAccess(h) == true) {
      hacked = [ns.getServer(h)].concat(hacked);
    }
    hacked = hacked.concat(await get_hacked(ns, h, host));
  }
  return hacked;
}

export function get_hack_level(ns) {
  const HACK_FUNCTION_LIST = [
    "BruteSSH.exe",
    "FTPCrack.exe",
    "relaySMTP.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
  ];
  return ns.ls("home", "exe").filter((a) => {
    return contains(HACK_FUNCTION_LIST, a);
  }).length;
}

export function contains(array, string) {
  return array.indexOf(string) > -1;
}

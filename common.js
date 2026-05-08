export async function get_hacked(ns, host, origin) {
  const hacked = [];
  const purchased = new Set(ns.cloud.getServerNames());
  const visited = new Set([origin]);

  async function descend(h) {
    for (const neighbor of ns.scan(h)) {
      if (visited.has(neighbor) || purchased.has(neighbor)) continue;
      visited.add(neighbor);
      if (ns.hasRootAccess(neighbor)) hacked.push(ns.getServer(neighbor));
      await descend(neighbor);
    }
  }

  await descend(host);
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
  return ns.ls("home", "exe").filter((a) => HACK_FUNCTION_LIST.includes(a)).length;
}

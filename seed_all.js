/** @param {NS} ns */

function contains(array, string){
  return array.indexOf(string) > -1;
}

export async function main(ns) {
  var available_scripts = ns.ls("home", "exe");
  var local = ns.scan();
  ns.print(local);
  for(var host of local){
    if(host == ns.args[0] || ns.getServerRequiredHackingLevel(host) > ns.getHackingLevel()){
      continue;
    }
    ns.scp(['get_started.js', 'generic.js', 'seed_all.js'], host);
    if(ns.hasRootAccess(host) == false){
      var hack_level = 0;
      if(contains(available_scripts, "BruteSSH.exe")){
        hack_level++;
        ns.brutessh(host);
      }
      if(contains(available_scripts, "FTPCrack.exe")){
        hack_level++;
        ns.ftpcrack(host);
      }
      if(contains("relaySMTP.exe", available_scripts)){
        hack_level++;
        ns.relaysmtp(host);
      }
      if(ns.getServerNumPortsRequired(host) <= hack_level){
        ns.nuke(host);
      }
    }
    else{
      ns.killall(host);
    }
    ns.exec('seed_all.js', host, 1, ns.getHostname());
    ns.print("Started run on "+host);
  }
  if(ns.getHostname() != 'home'){
    ns.run('get_started.js', 1);
  }
}
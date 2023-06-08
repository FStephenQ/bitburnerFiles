/// <reference path="NetscriptDefinitions.d.ts"/>

import { get_hacked, contains } from "./common";

/** @param {NS} ns */
export async function main(ns) {
    var previous_hacked_length = 0;
    while (true) {
        ns.run("hack_all.js");
        await ns.sleep(1000);
        /** @type {Server[]} hacked */
        var hacked = await get_hacked(ns, "home", "home");
        if (hacked.length <= previous_hacked_length) {
            ns.sleep(15 * 1000 * 60);
        } else {
            hacked = hacked.sort((a, b) => b.moneyMax - a.moneyMax);
            for(var serv of hacked){
                await buy_kill_server(ns, serv);
                ns.tprint("-------------------");
            }
            ns.tprint("All possible kill servers configured. Sleeping for 15 minutes");
            previous_hacked_length = hacked.length;
            await ns.sleep(15*1000*60);
        }
    }
}

/** @param {NS} ns, @param {Server} server*/
async function buy_kill_server(ns, server) {
    ns.tprint(
        `Working on kill server for ${server.hostname}, with max money ${ns.formatNumber(
            server.moneyMax
        )}`
    );
    var attack_host = "generic-" + server.hostname;
    if (contains(ns.getPurchasedServers(), attack_host)) {
        ns.tprint(`Kill server for ${server.hostname} already purchased, skipping`);
        return;
    }
    var diff = server.moneyMax / server.moneyAvailable;
    if(diff == Infinity || diff == 1 || isNaN(diff)){
        ns.tprint("Server worthless, skipping");
        return;
    }
    var cost_to_hit = Math.ceil(ns.growthAnalyze(server.hostname, diff));
    var threads = Math.ceil(ns.getScriptRam("generic.js") * cost_to_hit);
    ns.tprint(`It would take ${cost_to_hit} invocations to reach that max, or ${ns.formatRam(threads)} worth of RAM`);
    ns.tprint(
        `That would create a security increase of ${ns.growthAnalyzeSecurity(cost_to_hit)}, which would take ${
            ns.growthAnalyzeSecurity(cost_to_hit) / ns.weakenAnalyze(cost_to_hit)
        } weakens with that same power to mitigate`
    );
    var ram = 1 << (31 - Math.clz32(threads));
    //ns.tprint(Math.log2(ram));
    if(ram > 2**20){
        ns.tprint("Required server is too big, skipping");
        return;
    }
    const cost = ns.getPurchasedServerCost(ram);
    if(cost > ns.getServerMoneyAvailable('home')){
        ns.tprint("Server costs too much, skipping");
    }
    ns.purchaseServer(attack_host, ram);
    ns.tprint("Server purchased, setting up killscripts");
    ns.scp(['fill_all.js', 'generic.js'], attack_host);
    ns.exec("fill_all.js", attack_host, 1, "generic.js", server.hostname);
    ns.tprint("Killscripts initiated. Moving on to next target");
    return;
}

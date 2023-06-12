/// <reference path="NetscriptDefinitions.d.ts"/>

import { get_hacked, contains } from "/common";

function wout(ns, output) {
    ns.write("master.log.txt", output + "\n", "a");
}

/** @param {NS} ns */
export async function main(ns) {
    var previous_hacked_length = 0;
    while (true) {
        ns.write("master.log.txt", "", "w");
        ns.run("hack_all.js");
        await ns.sleep(1000);
        /** @type {Server[]} hacked */
        var hacked = await get_hacked(ns, "home", "home");
        if (hacked.length <= previous_hacked_length) {
            await ns.sleep(15 * 1000 * 60);
        } else {
            hacked = hacked.sort((a, b) => b.moneyMax - a.moneyMax);
            if(ns.fileExists('.clean_home')){
                ns.scriptKill('generic.js', 'home');
                ns.exec('fill_all.js', 'home', 1, 'generic.js', hacked[0].hostname);
            }
            if (ns.getPurchasedServers().length >= ns.getPurchasedServerLimit() - 2) {
                wout(ns, "Too many servers. Deleting");
                ns.getScriptExpGain()
                for (var del of hacked.slice(ns.getPurchasedServerLimit() - 3)) {
                    if (contains(ns.getPurchasedServers(), `generic-${del.hostname}`)) {
                        wout(ns, "Deleting generic-" + del.hostname);
                        await ns.killall(`generic-${del.hostname}`);
                        ns.deleteServer(`generic-${del.hostname}`);
                    }
                }
            }
            if (hacked.length >= ns.getPurchasedServerLimit() - 2) {
                wout(ns, `Too many hacked servers; getting top ${ns.getPurchasedServerLimit()-2}`);
                hacked = hacked.slice(0, ns.getPurchasedServerLimit() - 2);
            }
            for (var serv of hacked) {
                await buy_kill_server(ns, serv);
                wout(ns, "-------------------");
            }
            wout(ns, "All possible kill servers configured. Sleeping.");
            previous_hacked_length = hacked.length;
            await ns.sleep(Math.max(15 * 1000 * 60, ns.getWeakenTime(hacked[0].hostname)));
        }
    }
}

/** @param {NS} ns, @param {Server} server*/
async function buy_kill_server(ns, server) {
    wout(ns, `Working on kill server for ${server.hostname}, with max money ${ns.formatNumber(server.moneyMax)}`);
    var attack_host = `generic-${server.hostname}`;
    if (contains(ns.getPurchasedServers(), attack_host)) {
        wout(ns, `Kill server for ${server.hostname} already purchased, skipping`);
        return;
    }
    if (server.moneyMax == 0) {
        wout(ns, "Server worthless, skipping");
        return;
    }
    var diff = server.moneyMax / server.moneyAvailable;
    if (diff == Infinity || isNaN(diff) || diff == 1) {
        diff = 20;
    }
    var cost_to_hit = Math.ceil(ns.growthAnalyze(server.hostname, diff));
    var threads = Math.ceil(ns.getScriptRam("generic.js") * cost_to_hit);
    wout(ns, `It would take ${cost_to_hit} invocations to reach that max, or ${ns.formatRam(threads)} worth of RAM`);
    wout(
        ns,
        `That would create a security increase of ${ns.growthAnalyzeSecurity(cost_to_hit)}, which would take ${
            ns.growthAnalyzeSecurity(cost_to_hit) / ns.weakenAnalyze(cost_to_hit)
        } weakens with that same power to mitigate`
    );
    var ram = 1 << (31 - Math.clz32(threads));
    //wout(ns,Math.log2(ram));
    if (ram > 2 ** 20) {
        wout(ns, "Required server is too big, skipping");
        return;
    }
    const cost = ns.getPurchasedServerCost(ram);
    wout(ns, `Server would cost ${ns.formatNumber(cost)}`);
    if (cost > ns.getServerMoneyAvailable("home")) {
        wout(ns, "Server costs too much, skipping");
        return;
    }
    ns.purchaseServer(attack_host, ram);
    wout(ns, "Server purchased, setting up killscripts");
    ns.scp(["fill_all.js", "generic.js"], attack_host);
    ns.exec("fill_all.js", attack_host, 1, "generic.js", server.hostname);
    wout(ns, "Killscripts initiated. Moving on to next target");
    return;
}

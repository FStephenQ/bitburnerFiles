/// <reference path="NetscriptDefinitions.d.ts"/>

const STEAL = 0.5;
const OFFSET = 100;

/** Like batch_controller.js but runs on home alongside other daemons.
 *  Does NOT kill existing processes; sizes each batch to whatever RAM
 *  is free at launch time so it coexists with master/hacknet/darknet.
 *  @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0];
    const HOST = ns.getHostname();

    while (true) {
        // Prep: weaken to min security
        while (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + 0.05) {
            const weakenRam = ns.getScriptRam('once_weaken.js');
            const avail = ns.getServerMaxRam(HOST) - ns.getServerUsedRam(HOST);
            const threads = Math.max(1, Math.floor(avail / weakenRam));
            ns.exec('once_weaken.js', HOST, threads, target, 0);
            await ns.sleep(ns.getWeakenTime(target) + 500);
        }

        // Prep: grow to max money
        while (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) * 0.99) {
            const growRam = ns.getScriptRam('once_grow.js');
            const avail = ns.getServerMaxRam(HOST) - ns.getServerUsedRam(HOST);
            const threads = Math.max(1, Math.floor(avail / growRam));
            ns.exec('once_grow.js', HOST, threads, target, 0);
            await ns.sleep(ns.getGrowTime(target) + 500);
            const secExcess = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
            if (secExcess > 0.05) {
                const weakenRam = ns.getScriptRam('once_weaken.js');
                const wAvail = ns.getServerMaxRam(HOST) - ns.getServerUsedRam(HOST);
                const wThreads = Math.max(1, Math.floor(wAvail / weakenRam));
                ns.exec('once_weaken.js', HOST, wThreads, target, 0);
                await ns.sleep(ns.getWeakenTime(target) + 500);
            }
        }

        // Size batch to available RAM at this moment
        const hackRam  = ns.getScriptRam('once_hack.js');
        const growRam  = ns.getScriptRam('once_grow.js');
        const weakenRam = ns.getScriptRam('once_weaken.js');
        const avail = ns.getServerMaxRam(HOST) - ns.getServerUsedRam(HOST);

        const hackPct  = Math.max(ns.hackAnalyze(target), 0.001);
        const ideal_h  = Math.ceil(STEAL / hackPct);
        const ideal_g  = Math.ceil(ns.growthAnalyze(target, 1 / (1 - STEAL)));
        const ideal_w1 = Math.ceil(ideal_h * 0.002 / 0.05);
        const ideal_w2 = Math.ceil(ideal_g * 0.004 / 0.05);
        const ideal_ram = ideal_h * hackRam + ideal_g * growRam + (ideal_w1 + ideal_w2) * weakenRam;

        const scale = Math.min(1, avail / ideal_ram);
        const h  = Math.max(1, Math.floor(ideal_h  * scale));
        const g  = Math.max(1, Math.floor(ideal_g  * scale));
        const w1 = Math.max(1, Math.floor(ideal_w1 * scale));
        const w2 = Math.max(1, Math.floor(ideal_w2 * scale));

        if (avail < h * hackRam + g * growRam + (w1 + w2) * weakenRam) {
            await ns.sleep(5000);
            continue;
        }

        const wt = ns.getWeakenTime(target);
        const ht = ns.getHackTime(target);
        const gt = ns.getGrowTime(target);

        ns.exec('once_hack.js',   HOST, h,  target, wt - ht - OFFSET);
        ns.exec('once_weaken.js', HOST, w1, target, 0);
        ns.exec('once_grow.js',   HOST, g,  target, wt - gt + OFFSET);
        ns.exec('once_weaken.js', HOST, w2, target, 2 * OFFSET);

        await ns.sleep(wt + 2 * OFFSET + 500);
    }
}

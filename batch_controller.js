/// <reference path="NetscriptDefinitions.d.ts"/>

const OFFSET = 100; // ms between operation landings

/** @param {NS} ns */
export async function main(ns) {
    const [target, h_str, g_str, w1_str, w2_str] = ns.args;
    const h = parseInt(h_str), g = parseInt(g_str);
    const w1 = parseInt(w1_str), w2 = parseInt(w2_str);
    const HOST = ns.getHostname();

    for (const proc of ns.ps(HOST)) {
        if (proc.pid !== ns.pid) ns.kill(proc.pid);
    }
    await ns.sleep(200);

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
            // Weaken to offset grow security gain
            const secExcess = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
            if (secExcess > 0.05) {
                const weakenRam = ns.getScriptRam('once_weaken.js');
                const wAvail = ns.getServerMaxRam(HOST) - ns.getServerUsedRam(HOST);
                const wThreads = Math.max(1, Math.floor(wAvail / weakenRam));
                ns.exec('once_weaken.js', HOST, wThreads, target, 0);
                await ns.sleep(ns.getWeakenTime(target) + 500);
            }
        }

        // HWGW batch: all four ops start together; additionalMsec staggers their landings:
        //   H lands at (weakenTime - OFFSET)
        //   W1 lands at (weakenTime)
        //   G lands at (weakenTime + OFFSET)
        //   W2 lands at (weakenTime + 2*OFFSET)
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

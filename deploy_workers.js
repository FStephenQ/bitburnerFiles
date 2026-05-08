/// <reference path="NetscriptDefinitions.d.ts"/>

/** @param {NS} ns */
export async function main(ns) {
    const [target, h_in, g_in, w_in] = ns.args;
    const h = parseInt(h_in), g = parseInt(g_in), w = parseInt(w_in);
    const HOST = ns.getHostname();

    for (const proc of ns.ps(HOST)) {
        if (proc.pid !== ns.pid) ns.kill(proc.pid);
    }
    await ns.sleep(200);

    if (h > 0) ns.exec('just_hack.js', HOST, h, target);
    if (g > 0) ns.exec('just_growth.js', HOST, g, target);
    if (w > 0) ns.exec('just_weaken.js', HOST, w, target);
}

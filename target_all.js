/// <reference path="NetscriptDefinitions.d.ts"/>

import { get_hacked } from "/common";

const STEAL = 0.5;

/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0];

    ns.run("hack_all.js");
    await ns.sleep(1000);
    /** @type {Server[]} hacked */
    var hacked = await get_hacked(ns, "home", "home");

    const BATCH_CTRL_RAM = ns.getScriptRam('batch_controller.js');
    const HACK_RAM = ns.getScriptRam('once_hack.js');
    const GROW_RAM = ns.getScriptRam('once_grow.js');
    const WEAKEN_RAM = ns.getScriptRam('once_weaken.js');
    const WORKER_FILES = ['once_hack.js', 'once_grow.js', 'once_weaken.js', 'batch_controller.js'];

    const hackPct = Math.max(ns.hackAnalyze(target), 0.001);
    const ideal_h = Math.ceil(STEAL / hackPct);
    const ideal_g = Math.ceil(ns.growthAnalyze(target, 1 / (1 - STEAL)));
    const ideal_w1 = Math.ceil(ideal_h * 0.002 / 0.05);
    const ideal_w2 = Math.ceil(ideal_g * 0.004 / 0.05);
    const ideal_worker_ram = ideal_h * HACK_RAM + ideal_g * GROW_RAM + (ideal_w1 + ideal_w2) * WEAKEN_RAM;

    var total_ram_deployed = 0;
    for (var host of hacked) {
        if (host.hostname === "home" || ns.cloud.getServerNames().includes(host.hostname) || !host.hasAdminRights) {
            continue;
        }
        const available = host.maxRam - BATCH_CTRL_RAM;
        if (available < HACK_RAM + GROW_RAM + WEAKEN_RAM) continue;

        const scale = available / ideal_worker_ram;
        const h = Math.max(1, Math.floor(ideal_h * scale));
        const g = Math.max(1, Math.floor(ideal_g * scale));
        const w1 = Math.max(1, Math.floor(ideal_w1 * scale));
        const w2 = Math.max(1, Math.floor(ideal_w2 * scale));

        if (host.ramUsed > 0) ns.killall(host.hostname);
        ns.scp(WORKER_FILES, host.hostname);
        ns.exec('batch_controller.js', host.hostname, 1, target, h, g, w1, w2);
        total_ram_deployed += host.maxRam;
    }

    ns.tprint(`Deployed batch controllers across ${ns.format.ram(total_ram_deployed)} on ${target}`);
}

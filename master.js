/// <reference path="NetscriptDefinitions.d.ts"/>

import { get_hacked } from "/common";

const WORKER_FILES = ['once_hack.js', 'once_grow.js', 'once_weaken.js', 'batch_controller.js'];
const STEAL = 0.5;

function wout(ns, output) {
    ns.write("master.log.txt", output + "\n", "a");
}

/** @param {NS} ns @param {string} target */
function calc_batch_params(ns, target) {
    const BATCH_CTRL_RAM = ns.getScriptRam('batch_controller.js');
    const HACK_RAM = ns.getScriptRam('once_hack.js');
    const GROW_RAM = ns.getScriptRam('once_grow.js');
    const WEAKEN_RAM = ns.getScriptRam('once_weaken.js');

    const hackPct = Math.max(ns.hackAnalyze(target), 0.001);
    const h = Math.ceil(STEAL / hackPct);
    const g = Math.ceil(ns.growthAnalyze(target, 1 / (1 - STEAL)));
    const w1 = Math.ceil(h * 0.002 / 0.05);
    const w2 = Math.ceil(g * 0.004 / 0.05);
    const ideal_ram = BATCH_CTRL_RAM + h * HACK_RAM + g * GROW_RAM + (w1 + w2) * WEAKEN_RAM;
    return { h, g, w1, w2, ideal_ram };
}

/** @param {NS} ns */
export async function main(ns) {
    var previous_hacked_length = 0;
    while (true) {
        ns.write("master.log.txt", "", "w");
        ns.run("hack_all.js");
        await ns.sleep(1000);

        const all_hacked = await get_hacked(ns, "home", "home");
        if (all_hacked.length <= previous_hacked_length) {
            await ns.sleep(15 * 1000 * 60);
            continue;
        }
        previous_hacked_length = all_hacked.length;

        /** @type {Server[]} */
        var hacked = all_hacked
            .filter(h => h.moneyMax > 0 && ns.hackAnalyzeChance(h.hostname) >= 0.25)
            .sort((a, b) => {
                const score = s => ns.hackAnalyzeChance(s.hostname) * s.moneyMax / (s.minDifficulty * ns.getWeakenTime(s.hostname));
                return score(b) - score(a);
            });

        if (hacked.length === 0) {
            await ns.sleep(15 * 1000 * 60);
            continue;
        }

        if (ns.fileExists('clean_home.txt')) {
            ns.scriptKill('generic.js', 'home');
            ns.run('contracts/solve_contracts.js');
            await ns.sleep(1000);

            const bestTarget = hacked[0].hostname;
            const homeBatch = ns.ps('home').find(p => p.filename === 'home_batch.js');
            if (!homeBatch || String(homeBatch.args[0]) !== bestTarget) {
                ns.scriptKill('home_batch.js', 'home');
                ns.exec('home_batch.js', 'home', 1, bestTarget);
            }

            ns.exec('target_all.js', 'home', 1, bestTarget);
        }

        if (ns.cloud.getServerNames().length >= ns.cloud.getServerLimit() - 2) {
            wout(ns, "Too many servers. Deleting");
            for (var del of hacked.slice(ns.cloud.getServerLimit() - 3)) {
                const del_host = `generic-${del.hostname}`;
                if (ns.cloud.getServerNames().includes(del_host)) {
                    wout(ns, `Deleting ${del_host}`);
                    ns.killall(del_host);
                    ns.cloud.deleteServer(del_host);
                }
            }
        }

        if (hacked.length >= ns.cloud.getServerLimit() - 2) {
            wout(ns, `Too many hacked servers; capping at top ${ns.cloud.getServerLimit() - 2}`);
            hacked = hacked.slice(0, ns.cloud.getServerLimit() - 2);
        }

        for (var serv of hacked) {
            await buy_or_upgrade_server(ns, serv);
            wout(ns, "-------------------");
        }

        wout(ns, "All kill servers configured. Sleeping.");
        await ns.sleep(Math.max(15 * 1000 * 60, ns.getWeakenTime(hacked[0].hostname)));
    }
}

/** @param {NS} ns @param {Server} server */
async function buy_or_upgrade_server(ns, server) {
    const attack_host = `generic-${server.hostname}`;

    const { h, g, w1, w2, ideal_ram } = calc_batch_params(ns, server.hostname);
    const ram_needed = Math.ceil(ideal_ram);
    const ram = ram_needed <= 1 ? 1 : 1 << (32 - Math.clz32(ram_needed - 1));

    wout(ns, `${server.hostname}: ${h}H/${g}G/${w1}W1/${w2}W2 → needs ${ns.format.ram(ram)}`);

    if (ram > 2 ** 20) {
        wout(ns, "Required server too large (>1 PiB), skipping");
        return;
    }

    if (ns.cloud.getServerNames().includes(attack_host)) {
        const current_ram = ns.getServerMaxRam(attack_host);
        if (current_ram >= ram) {
            const running = ns.ps(attack_host).some(p => p.filename === 'batch_controller.js');
            if (running) {
                wout(ns, `${attack_host} already ${ns.format.ram(current_ram)}, batch running`);
                return;
            }
            wout(ns, `${attack_host}: batch controller not running, restarting`);
            ns.killall(attack_host);
            ns.scp(WORKER_FILES, attack_host);
            ns.exec('batch_controller.js', attack_host, 1, server.hostname, h, g, w1, w2);
            return;
        }
        const upgrade_cost = ns.cloud.getServerUpgradeCost(attack_host, ram);
        wout(ns, `Upgrade cost: ${ns.format.number(upgrade_cost)}`);
        if (upgrade_cost > ns.getServerMoneyAvailable("home")) {
            wout(ns, "Upgrade too expensive, skipping");
            return;
        }
        wout(ns, `Upgrading ${attack_host}: ${ns.format.ram(current_ram)} → ${ns.format.ram(ram)}`);
        ns.killall(attack_host);
        ns.cloud.upgradeServer(attack_host, ram);
        ns.scp(WORKER_FILES, attack_host);
        ns.exec('batch_controller.js', attack_host, 1, server.hostname, h, g, w1, w2);
        return;
    }

    const cost = ns.cloud.getServerCost(ram);
    wout(ns, `Purchase cost: ${ns.format.number(cost)}`);
    if (cost > ns.getServerMoneyAvailable("home")) {
        wout(ns, "Too expensive, skipping");
        return;
    }

    ns.cloud.purchaseServer(attack_host, ram);
    wout(ns, `Purchased ${attack_host} (${ns.format.ram(ram)}), deploying batch controller`);
    ns.scp(WORKER_FILES, attack_host);
    ns.exec('batch_controller.js', attack_host, 1, server.hostname, h, g, w1, w2);
}

/// <reference path="NetscriptDefinitions.d.ts"/>

// Never spend more than this fraction of cash on a single hacknet action.
// Increase toward 1.0 if you want more aggressive spending.
const SPEND_RATIO = 0.10;

/** @param {NS} ns */
export async function main(ns) {
    while (true) {
        const action = bestAction(ns);

        if (!action) {
            await ns.sleep(10_000); // everything maxed
            continue;
        }

        const money = ns.getServerMoneyAvailable("home");
        // Bypass ratio for the very first node — no income without it.
        const limit = ns.hacknet.numNodes() === 0 ? money : money * SPEND_RATIO;

        if (action.cost <= limit) {
            action.execute();
            await ns.sleep(50);
        } else {
            await ns.sleep(3_000);
        }
    }
}

/**
 * Evaluates every possible hacknet action and returns the one with the
 * highest production gain per dollar (ROI). Returns null if all maxed.
 */
function bestAction(ns) {
    let best = null;
    const n = ns.hacknet.numNodes();

    // Option: buy a new node
    if (n < ns.hacknet.maxNumNodes()) {
        const cost = ns.hacknet.getPurchaseNodeCost();
        // If no nodes exist yet, use Infinity so it's always selected.
        // Otherwise estimate the fresh node's production from node 0's stats.
        const gain = n === 0 ? Infinity : baseProdRate(ns);
        const roi = gain / cost;
        if (!best || roi > best.roi) {
            best = { roi, cost, execute: () => ns.hacknet.purchaseNode() };
        }
    }

    for (let i = 0; i < n; i++) {
        const stats = ns.hacknet.getNodeStats(i);
        const prod = stats.production;

        // Level: production is linear in level → gain = prod / level
        const levelCost = ns.hacknet.getLevelUpgradeCost(i, 1);
        if (isFinite(levelCost)) {
            const roi = (prod / stats.level) / levelCost;
            if (!best || roi > best.roi) {
                best = { roi, cost: levelCost, execute: () => ns.hacknet.upgradeLevel(i, 1) };
            }
        }

        // RAM: production ∝ 1.035^(ram-1); doubling ram multiplies by 1.035^ram
        const ramCost = ns.hacknet.getRamUpgradeCost(i, 1);
        if (isFinite(ramCost)) {
            const roi = (prod * (Math.pow(1.035, stats.ram) - 1)) / ramCost;
            if (!best || roi > best.roi) {
                best = { roi, cost: ramCost, execute: () => ns.hacknet.upgradeRam(i, 1) };
            }
        }

        // Cores: production ∝ (cores+5)/6 → one more core adds prod/(cores+5)
        const coreCost = ns.hacknet.getCoreUpgradeCost(i, 1);
        if (isFinite(coreCost)) {
            const roi = (prod / (stats.cores + 5)) / coreCost;
            if (!best || roi > best.roi) {
                best = { roi, cost: coreCost, execute: () => ns.hacknet.upgradeCore(i, 1) };
            }
        }
    }

    return best;
}

/**
 * Infers the base production rate ($/s at level=1, ram=1, cores=1) from node 0.
 * Used to estimate what a freshly purchased node would produce.
 */
function baseProdRate(ns) {
    const s = ns.hacknet.getNodeStats(0);
    return s.production / (s.level * Math.pow(1.035, s.ram - 1) * (s.cores + 5) / 6);
}

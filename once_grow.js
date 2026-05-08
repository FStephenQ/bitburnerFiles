/// <reference path="NetscriptDefinitions.d.ts"/>
/** @param {NS} ns */
export async function main(ns) {
    await ns.grow(ns.args[0], { additionalMsec: parseInt(ns.args[1] ?? 0) });
}

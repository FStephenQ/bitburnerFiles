/// <reference path="NetscriptDefinitions.d.ts"/>

/** @param {NS} ns */
export async function main(ns) {
    ns.purchaseServer(ns.args[0], 2 ** ns.args[1]);
}
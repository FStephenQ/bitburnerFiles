/// <reference path="NetscriptDefinitions.d.ts"/>

/** @param {NS} ns */
export async function main(ns) {
    ns.cloud.deleteServer(ns.args[0]);
}
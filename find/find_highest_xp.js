/// <reference path="../NetscriptDefinitions.d.ts"/>

import { get_hacked } from "/common";

/** @param {NS} ns */
export async function main(ns) {
    /** @type {Server[]} hacked */
    var hacked = await get_hacked(ns, 'home', 'home');
    var highest = 0;
    var host = '';
    var time = 0;
    ns.tail();
    var available_threads = ns.getServerMaxRam('home')/ns.getScriptRam('just_hack.js');
    for(var h of hacked){
        var h_xp = ns.formulas.hacking.hackExp(h, ns.getPlayer());
        var hack_time = ns.formulas.hacking.hackTime(h, ns.getPlayer());
        var xp_per_unit_time = (h_xp*available_threads)/hack_time;
        ns.print(`XP for ${h.hostname} is ${xp_per_unit_time}`);
        if(xp_per_unit_time > highest){
            highest = xp_per_unit_time;
            host = h.hostname;
            time = hack_time;
        }
        ns.print(`Hack time is ${ns.tFormat(hack_time)}`);
    }
    ns.print(`Highest XP is with ${host}, with ${highest} XP every ${time}`);
}
/// <reference path="../NetscriptDefinitions.d.ts"/>

/** @param {NS} ns */
export async function main(ns) {
    ns.corporation.getCorporation()
    ns.corporation.createCorporation("EvilCorp", true);
    
}

/** @param {NS} ns */
export async function add_employees(ns, division_name, city_name){

    ns.corporation.upgradeOfficeSize(division_name, city_name, 15);

}
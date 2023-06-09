/// <reference path="../NetscriptDefinitions.d.ts"/>

import { contains } from "/common.js";
import { find_contracts } from "/find/find_contracts.js";
import { compression_two } from "/contracts/compression2.js";
import { find_valid_ip } from "/contracts/ip_from_str";
import { stocks_1 } from "/contracts/stocks1";
import { merge_overlapping_intervals } from "/contracts/merge_overlapping_intervals";

const SOLVABLE_CONTRACTS_MAP = {
    'Compression II: LZ Decompression': compression_two,
    'Generate IP Addresses': find_valid_ip,
    'Algorithmic Stock Trader I': stocks_1,
    'Merge Overlapping Intervals': merge_overlapping_intervals
}

/** @param {NS} ns */
export async function main(ns) {
    var contracts = await find_contracts(ns, 'home', 'home', '');
    for(var contract of contracts){
        if(contains(Object.keys(SOLVABLE_CONTRACTS_MAP), contract.type)){
            var data = ns.codingcontract.getData(contract.filename, contract.hostname);
            ns.codingcontract.attempt(SOLVABLE_CONTRACTS_MAP[contract.type](ns, data), contract.filename, contract.hostname);
        }
    }
}
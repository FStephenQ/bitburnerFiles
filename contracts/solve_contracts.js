/// <reference path="../NetscriptDefinitions.d.ts"/>

import { contains } from "/common.js";
import { find_contracts } from "/find/find_contracts.js";
import { compression_two } from "/contracts/compression2.js";
import { find_valid_ip } from "/contracts/ip_from_str";
import { stocks_1 } from "/contracts/stocks1";
import { merge_overlapping_intervals } from "/contracts/merge_overlapping_intervals";
import { largest_prime_factor } from "/contracts/prime_factor";
import { compression_one } from "/contracts/compression1";

const SOLVABLE_CONTRACTS_MAP = {
    'Compression I: RLE Compression': compression_one,
    'Compression II: LZ Decompression': compression_two,
    'Generate IP Addresses': find_valid_ip,
    'Algorithmic Stock Trader I': stocks_1,
    'Merge Overlapping Intervals': merge_overlapping_intervals,
    'Find Largest Prime Factor': largest_prime_factor
}

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('scan');
    ns.clearLog();
    var contracts = await find_contracts(ns, 'home', 'home', '');
    for(var contract of contracts){
        if(contains(Object.keys(SOLVABLE_CONTRACTS_MAP), contract.type)){
            var data = ns.codingcontract.getData(contract.filename, contract.hostname);
            ns.codingcontract.attempt(SOLVABLE_CONTRACTS_MAP[contract.type](ns, data), contract.filename, contract.hostname);
        }
    }
}
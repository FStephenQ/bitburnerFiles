/// <reference path="../NetscriptDefinitions.d.ts"/>

import { contains } from "/common.js";
import { find_contracts } from "/find/find_contracts.js";
import { compression_two } from "/contracts/compression2.js";
import { find_valid_ip } from "/contracts/ip_from_str";
import { stocks_1 } from "/contracts/stocks1";
import { merge_overlapping_intervals } from "/contracts/merge_overlapping_intervals";
import { largest_prime_factor } from "/contracts/prime_factor";
import { compression_one } from "/contracts/compression1";
import { stocks_2 } from "/contracts/stocks2";
import { ceasar_cipher } from "/contracts/ceasar";
import { grid_paths_1 } from "/contracts/grid_paths_1";
import { subset_sum } from "/contracts/subset_sum";
import { vingenere } from "/contracts/vigenere";
import { ways_to_sum } from "/contracts/ways_to_sum";
import { stolen_shortest_path } from "/contracts/shortest_path_grid";
import { triangle_min_sum } from "./triangle_min_sum";
import { sanitize_parens } from "./sanitize_parens";
import { array_jumping_game_2 } from "./array_jumping_game_2";

const SOLVABLE_CONTRACTS_MAP = {
    'Subarray with Maximum Sum': subset_sum,
    'Compression I: RLE Compression': compression_one,
    'Compression II: LZ Decompression': compression_two,
    'Generate IP Addresses': find_valid_ip,
    'Unique Paths in a Grid I': grid_paths_1,
    'Shortest Path in a Grid': stolen_shortest_path,
    'Algorithmic Stock Trader I': stocks_1,
    'Algorithmic Stock Trader II': stocks_2,
    'Merge Overlapping Intervals': merge_overlapping_intervals,
    'Find Largest Prime Factor': largest_prime_factor,
    'Encryption I: Caesar Cipher': ceasar_cipher,
    'Encryption II: Vigenère Cipher': vingenere,
    'Total Ways to Sum': ways_to_sum,
    'Minimum Path Sum in a Triangle': triangle_min_sum,
    'Sanitize Parentheses in Expression': sanitize_parens,
    'Array Jumping Game II': array_jumping_game_2
}

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('scan');
    ns.clearLog();
    ns.write("unsolvable_contracts.txt", "", "w");
    ns.write("failed_contracts.txt", "", "w");
    var contracts = await find_contracts(ns, 'home', 'home', '');
    var solved = 0;
    ns.tprint(`Attempting to solve ${contracts.length} contracts`);
    for (var contract of contracts) {
        if (contains(Object.keys(SOLVABLE_CONTRACTS_MAP), contract.type)) {
            var data = ns.codingcontract.getData(contract.filename, contract.hostname);
            var result = ns.codingcontract.attempt(SOLVABLE_CONTRACTS_MAP[contract.type](ns, data), contract.filename, contract.hostname);
            if (result != '') {
                solved++;
                ns.tprint(result);
            } else {
                ns.write("failed_contracts.txt", contract.str + '\n', "a");
            }
        }
        else {
            ns.write("unsolvable_contracts.txt", contract.str + '\n', "a");
        }
    }
    ns.tprint(`Solved ${solved} contracts`);
}
/** @param {NS} ns */
/*
Given the following array of arrays of numbers representing a list of intervals, 
merge all overlapping intervals.

[[18,19],[5,15],[9,11],[8,14],[3,7],[6,10],[5,14],[25,34],[14,24],[24,25]]

Example:

[[1, 3], [8, 10], [2, 6], [10, 16]]

would merge into [[1, 6], [8, 16]].

The intervals must be returned in ASCENDING order.
 You can assume that in an interval, the first number will always be smaller than the second.
*/

export async function main(ns) {
  var intervals = [];
  intervals = intervals.sort((a, b) => {b[0]-a[0]});
  
}
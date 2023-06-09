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

/** @param {NS} ns */
export async function main(ns) {
  var input = [[9,11],[23,31],[10,13],[20,27]];
  ns.tail();
  ns.print(merge_overlapping_intervals(ns, input));
}

/** @param {NS} ns */
export function merge_overlapping_intervals(ns, input){
  var ret = [];
  var intervals = [];
  intervals = input.sort((a, b) => {return a[0]-b[0]});
  var largest = intervals[0][1];
  var start = intervals[0][0];
  for(var i of intervals){
    if(i[0] < largest){
      if(i[1] > largest){
        largest = i[1];
      }
    }
    else{
      ret.push([start, largest]);
      start = i[0];
      largest = i[1];
    }
  }
  if(ret.slice(-1)[0][1] != largest){
    ret.push([start, largest]);
  }
  return ret;
}
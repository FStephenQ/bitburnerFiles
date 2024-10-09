/*Array Jumping Game II
You are attempting to solve a Coding Contract. You have 3 tries remaining, after which the contract will self-destruct.


You are given the following array of integers:

1,6,7,4,5,2,0,2,4,3,2,2,4,2,2,2,3,2,1,2

Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n.

Assuming you are initially positioned at the start of the array, determine the minimum number of jumps to reach the end of the array.

If it's impossible to reach the end, then the answer should be 0.


If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.*/


export async function main(ns) {
    let result = array_jumping_game_2(ns, [1, 6, 7, 4, 5, 2, 0, 2, 4, 3, 2, 2, 4, 2, 2, 2, 3, 2, 1, 2]);
    ns.tprint(result);
}

export function array_jumping_game_2(ns, arr) {
    if (arr.length <= 1) return 0;
    if (arr[0] === 0) return 0;
    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        farthest = Math.max(farthest, i + arr[i]);
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
            if (currentEnd >= arr.length - 1) break;
        }
    }
    return currentEnd >= arr.length - 1 ? jumps : 0;
}
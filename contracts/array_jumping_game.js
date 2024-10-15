/*
Array Jumping Game
You are attempting to solve a Coding Contract. You have 1 tries remaining, after which the contract will self-destruct.


You are given the following array of integers:

[8,10,0,0,0,7,6,2,10,10,8,8,2,0,0,0,7,0,1,9,5,0,7,0]

Each element in the array represents your MAXIMUM jump length at that position. 
This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n.

Assuming you are initially positioned at the start of the array, determine whether you are able to reach the last index.

Your answer should be submitted as 1 or 0, representing true and false respectively.


If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.*/

export async function main(ns) {
    var result = array_jumping_game(ns, [8,10,0,0,0,7,6,2,10,10,8,8,2,0,0,0,7,0,1,9,5,0,7,0]);
    ns.print(result);
}

export function array_jumping_game(ns, arr) {
    if (arr.length <= 1) return 0;
    if (arr[0] === 0) return 0;
    let currentEnd = 0;
    let farthest = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        farthest = Math.max(farthest, i + arr[i]);
        if (i === currentEnd) {
            currentEnd = farthest;
            if (currentEnd >= arr.length - 1) break;
        }
    }
    return currentEnd >= arr.length - 1 ? 1 : 0;
}
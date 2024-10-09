/* 
Minimum Path Sum in a Triangle
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


Given a triangle, find the minimum path sum from top to bottom. In each step of the path, you may only move to adjacent numbers in the row below. 
The triangle is represented as a 2D array of numbers:

[
      [8],
     [1,9],
    [9,4,9],
   [3,4,2,5],
  [5,9,6,1,6]
]

Example: If you are given the following triangle:

[
     [2],
    [3,4],
   [6,5,7],
  [4,1,8,3]
]

The minimum path sum is 11 (2 -> 3 -> 5 -> 1).


If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.*/


export function main(ns){
  ns.print("triangle_min_sum");
    var strings = triangle_min_sum(ns, [
      [8],
     [1,9],
    [9,4,9],
   [3,4,2,5],
  [5,9,6,1,6]
  ]);
  ns.print(strings);
}

export function triangle_min_sum(ns, input){
    var triangle = input;
    var n = triangle.length;
    var dp = new Array(n).fill(0);
    for (var i = 0; i < n; i++) {
        dp[i] = triangle[n - 1][i];
    }
    for (var i = n - 2; i >= 0; i--) {
        for (var j = 0; j <= i; j++) {
            dp[j] = triangle[i][j] + Math.min(dp[j], dp[j + 1]);
        }
    }
    return dp[0];
}
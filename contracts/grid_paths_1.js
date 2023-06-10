/*
You are in a grid with 12 rows and 12 columns, and you are positioned in the top-left corner of that grid. You are trying to reach the bottom-right corner of the grid, but you can only move down or right on each step. Determine how many unique paths there are from start to finish.

NOTE: The data returned for this contract is an array with the number of rows and columns:

[12, 12]
*/

export async function main(ns){

    var strings = grid_paths_1(ns, [12,12]);
    ns.print(strings);
}

export function grid_paths_1(ns, input){
    // To reach the bottom right corner, we know that we need to go down X spaces and right Y spaces
    // I'm not remembering my linear algebra/combinatorics enough to remember how to do that right
    // But we can approximate it with gross logic
    input = [input[0]-1, input[1]-1]
    var length = input[0] + input[1];
    var strings = ['x', 'y'];
    for(var v = 1; v < length; v++){
        var tmp = [];
        for(var s of strings){
            if((s.match(/x/g) || []).length >= input[0]);
            else tmp.push(s+'x');
            if((s.match(/y/g) || []).length >= input[1]);
            else tmp.push(s+'y');
        }
        strings = tmp;
    }
    return strings.length;
}